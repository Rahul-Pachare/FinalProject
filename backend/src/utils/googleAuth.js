import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

// Generate the Google OAuth URL
export const getGoogleAuthURL = () => {
    const scopes = [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/gmail.modify",
        "https://mail.google.com/"
    ];

    return oauth2Client.generateAuthUrl({
        access_type: "offline", // Get refresh token
        scope: scopes,
    });
};
export const getGoogleUser = async (code) => {
    try {
      //  console.log("Authorization Code:", code);
        
        // Create a fresh OAuth2 client instance
        const oauth2ClientInstance = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );


        // Exchange authorization code for tokens
        const { tokens } = await oauth2ClientInstance.getToken(code);
        //console.log("Tokens Received:", tokens);

        oauth2ClientInstance.setCredentials(tokens);

        // Fetch user profile
        const { data } = await google.oauth2("v2").userinfo.get({ auth: oauth2ClientInstance });
        //console.log("User Data from Google:", data);

        // Validate user data
        if (!data.email || !data.name) {
            throw new Error("Invalid user data received from Google.");
        }

        return {
            tokens,
            user: {
                email: data.email,
                name: data.name,
                picture: data.picture,
            },
        };
    } catch (error) {
        console.error("Error getting Google user:", error.message);
        throw error;
    }
};

// Get tokens and user profile after OAuth callback
// export const getGoogleUser = async (code) => {
//     try {
//         console.log("Authorization Code:", code);

//         // Exchange authorization code for tokens
//         const { tokens } = await oauth2Client.getToken(code);
//         console.log("Tokens Received:", tokens);

//         oauth2Client.setCredentials(tokens);

//         // Fetch user profile
//         const { data } = await google.oauth2("v2").userinfo.get({ auth: oauth2Client });
//         console.log("User Data from Google:", data);

//         // Validate user data
//         if (!data.email || !data.name) {
//             throw new Error("Invalid user data received from Google.");
//         }

//         return {
//             tokens,
//             user: {
//                 email: data.email,
//                 name: data.name,
//                 picture: data.picture,
//             },
//         };
//     } catch (error) {
//         console.error("Error getting Google user:", error.message);
//         throw error;
//     }
// };