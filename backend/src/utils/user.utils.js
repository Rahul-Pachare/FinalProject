import { User } from '../models/user.model.js';

export const createOrUpdateUser = async (userData, tokens) => {
    const { email, name, picture } = userData;
    const { expiry_date, refresh_token, access_token } = tokens;

    // Calculate proper expiry date if it's not provided
    const expiryDate = expiry_date || new Date(Date.now() + 3600 * 1000); // Default 1 hour

    let user = await User.findOne({ email });

    if (user) {
        user.name = name;
        user.picture = picture;
        user.googleTokens = {
            expiryDate: expiryDate,
            // Keep the old refresh token if a new one isn't provided
            refreshToken: refresh_token || user.googleTokens.refreshToken,
            accessToken: access_token,
        };
        await user.save();
    } else {
        user = new User({
            email,
            name,
            picture,
            googleTokens: {
                expiryDate: expiryDate,
                refreshToken: refresh_token,
                accessToken: access_token,
            },
        });
        await user.save();
    }

    return user;
};