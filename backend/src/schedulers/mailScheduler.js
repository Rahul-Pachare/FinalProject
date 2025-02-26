
import cron from 'node-cron';
import { User } from '../models/user.model.js';
import { Mail } from '../models/mail.model.js';
import axios from 'axios';
import { refreshTokenIfNeeded } from '../utils/tokenRefresh.js';

// Function to detect spam (currently using random as in your existing code)
const spam_detection = () => {
  return Math.floor(Math.random() * 100);
};

// Main function to scan and add emails for all users
const scanAndAddEmails = async () => {
  console.log('Running scheduled email scan...');
  
  try {
    // Get all users
    const users = await User.find();
    
    if (!users || users.length === 0) {
      console.log('No users found for email scanning');
      return;
    }
    
    // Process each user
    for (const user of users) {
      try {
        // Refresh token if needed
        const refreshedUser = await refreshTokenIfNeeded(user);
        const accessToken = refreshedUser.googleTokens.accessToken;
        
        // Step 1: Fetch unread mail IDs
        const response = await axios.get(
          "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10&q=is:unread",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const messages = response.data.messages || [];
        console.log(`Found ${messages.length} unread messages for user ${user.email}`);
        
        // Step 2: Process each message
        const newMails = [];
        for (const message of messages) {
          if (!message.id || typeof message.id !== "string") {
            console.warn("Skipping message with invalid ID:", message);
            continue;
          }
          
          // Check if mail already exists in database
          const mailExists = await Mail.findOne({ messageID: message.id });
          
          if (!mailExists) {
            const spamScore = spam_detection();
            let status = "ham";
            
            if (spamScore >= 60 && spamScore <= 90) {
              status = "maybe_spam";
            } else if (spamScore > 90) {
              status = "spam";
            }
            
            // Create new mail record
            const mail = await Mail.create({
              messageID: message.id,
              owner: user._id,
              spam_confidence: spamScore,
              status,
            });
            
            newMails.push(mail);
          }
        }
        
        console.log(`Added ${newMails.length} new emails for user ${user.email}`);
      } catch (error) {
        console.error(`Error processing user ${user.email}:`, error.message);
        // Continue with next user even if this one fails
      }
    }
    
    console.log('Scheduled email scan completed');
  } catch (error) {
    console.error('Error in scheduled email scan:', error);
  }
};

// Schedule function - export this to use in app.js
export const startMailScheduler = () => {
  // Run every 15 minutes - adjust schedule as needed
  // The cron pattern is: minute hour day-of-month month day-of-week
  // '*/15 * * * *' means "every 15 minutes"
  cron.schedule('*/15 * * * *', async () => {
    console.log('Starting scheduled mail scan at', new Date().toISOString());
    await scanAndAddEmails();
  });
  
  console.log('Mail scheduler started');
};

// You can also export the scan function directly for manual triggering
export const manualScanEmails = scanAndAddEmails;