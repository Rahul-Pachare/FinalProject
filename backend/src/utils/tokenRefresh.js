import oauth2Client from '../config/googleAuth.js';
import { User } from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';

/**
 * Checks if a user's access token is expired and refreshes it if needed
 * @param {Object} user - User document from database
 * @returns {Object} - Updated user object with fresh tokens
 */
export const refreshTokenIfNeeded = async (user) => {
    try {
      if (!user || !user.googleTokens) {
        throw new ApiError(401, "Invalid user or missing tokens");
      }
 
      const { expiryDate, refreshToken } = user.googleTokens;
      const currentTime = new Date();
      
      // Check if token is expired or about to expire (within 5 minutes)
      const isExpired = new Date(expiryDate) <= new Date(currentTime.getTime() + 5 * 60 * 1000);
      
      if (isExpired && refreshToken) {
        try {
          // Set the refresh token in oauth2Client
          oauth2Client.setCredentials({
            
            refresh_token: refreshToken
          });
          
          // Get fresh tokens
          const { tokens } = await oauth2Client.refreshAccessToken();
          console.log("object",tokens)
          // Add proper error handling for the tokens response
          if (!tokens || !tokens.access_token) {
            throw new ApiError(401, "Invalid response from token refresh",tokens);
          }
          
          // Update user in database with new tokens
          user.googleTokens = {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token || refreshToken, // Keep old refresh token if new one not provided
            expiryDate: tokens.expiry_date || new Date(Date.now() + 3600 * 1000) // Default 1 hour if not provided
          };
          
          await user.save();
          console.log(`Refreshed access token for user ${user.email}`);
        } catch (tokenError) {
          console.error("Token refresh error details:", tokenError);
          
          // Check if this is an invalid_grant error
          if (tokenError.message?.includes('invalid_grant') || 
              tokenError.response?.data?.error === 'invalid_grant') {
            
            // Mark the user as needing re-authentication
            user.googleTokens.needsReauth = true;
            await user.save();
            
            console.log(`User ${user.email} needs to re-authenticate with Google`);
            throw new ApiError(401, "Authentication expired. Please log in again with Google.");
          }
          
          // Rethrow other errors
          throw new ApiError(401, `Failed to refresh token: ${tokenError.message}`);
        }
      }
      
      return user;
    } catch (error) {
      console.error("Token refresh error:", error);
      throw new ApiError(401, "Failed to refresh access token");
    }
  };

/**
 * Middleware to ensure user has valid tokens before processing request
 */
export const ensureValidToken = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(new ApiError(401, "User not authenticated"));
    }
    
    // Refresh token if needed and update req.user
    req.user = await refreshTokenIfNeeded(req.user);
    next();
  } catch (error) {
    next(error);
  }
};

// // backend/src/utils/tokenRefresh.js
// import oauth2Client from '../config/googleAuth.js';
// import { User } from '../models/user.model.js';
// import ApiError from '../utils/ApiError.js';

// /**
//  * Checks if a user's access token is expired and refreshes it if needed
//  * @param {Object} user - User document from database
//  * @returns {Object} - Updated user object with fresh tokens
//  */
// export const refreshTokenIfNeeded = async (user) => {
//     try {
//       if (!user || !user.googleTokens) {
//         throw new ApiError(401, "Invalid user or missing tokens");
//       }
  
//       const { expiryDate, refreshToken } = user.googleTokens;
//       const currentTime = new Date();
      
//       // Check if token is expired or about to expire (within 5 minutes)
//       const isExpired = new Date(expiryDate) <= new Date(currentTime.getTime() + 5 * 60 * 1000);
      
//       if (isExpired && refreshToken) {
//         try {
//           // Set the refresh token in oauth2Client
//           oauth2Client.setCredentials({
//             refresh_token: refreshToken
//           });
          
//           // Get fresh tokens
//           const { tokens } = await oauth2Client.refreshAccessToken();
          
//           // Update user in database with new tokens
//           user.googleTokens = {
//             accessToken: tokens.access_token,
//             refreshToken: tokens.refresh_token || refreshToken, // Keep old refresh token if new one not provided
//             expiryDate: tokens.expiry_date
//           };
          
//           await user.save();
//         } catch (tokenError) {
//           // Check if this is an invalid_grant error
//           if (tokenError.message?.includes('invalid_grant') || 
//               tokenError.response?.data?.error === 'invalid_grant') {
            
//             // Mark the user as needing re-authentication
//             user.googleTokens.needsReauth = true;
//             await user.save();
            
//             console.log(`User ${user.email} needs to re-authenticate with Google`);
//             throw new ApiError(401, "Authentication expired. Please log in again with Google.");
//           }
          
//           // Rethrow other errors
//           throw tokenError;
//         }
//       }
      
//       return user;
//     } catch (error) {
//       console.error("Token refresh error:", error);
//       throw new ApiError(401, "Failed to refresh access token");
//     }
//   };
// /**
//  * Middleware to ensure user has valid tokens before processing request
//  */
// export const ensureValidToken = async (req, res, next) => {
//   try {
//     if (!req.user) {
//       return next(new ApiError(401, "User not authenticated"));
//     }
    
//     // Refresh token if needed and update req.user
//     req.user = await refreshTokenIfNeeded(req.user);
//     next();
//   } catch (error) {
//     next(error);
//   }
// };