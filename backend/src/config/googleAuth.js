import { google } from 'googleapis';

// Configure OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
    {
      // Specify the grant type here
      grant_type: 'refresh_token'  // or another valid grant type
    }
  
);

export default oauth2Client;