import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import oauth2Client from '../config/googleAuth.js';
import { getGoogleUser } from '../utils/googleAuth.js';
import { createOrUpdateUser } from '../utils/user.utils.js';
dotenv.config();
const router = express.Router();

router.get('/google', (req, res) => {
    const scopes = [
    
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/gmail.modify",
    
    ];
    const url = oauth2Client.generateAuthUrl({
      access_type:'offline', // Request offline access to get a refresh token
      scope: scopes,
      prompt: "consent"
    });
    res.redirect(url);
  });

router.get("/callback", async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) {
            return res.status(400).json({ error: "Authorization code is missing." });
        }
        const { tokens, user } = await getGoogleUser(code);
        // const { tokens, user } = await getGoogleUser(code);
        // console.log("User Data from Google:", user,"token",tokens);
        const newUser = await createOrUpdateUser(user, tokens);
        const token = generateJWT(newUser._id);
        res.redirect(`http://localhost:5173?token=${token}`);
    } catch (error) {
        console.error("Error during OAuth callback:", error.message);
        res.status(500).json({ error: "Something went wrong during authentication." });
    }
  });

  export const generateJWT = (userId) => {
    const payload = { userId }; // The data to include in the token
    const secret = process.env.JWT_SECRET; // Secret key for signing the token
    const options = { expiresIn: '1h' }; // Token expiration time

    return jwt.sign(payload, secret, options);
};

export default router;