import { User } from '../models/user.model.js';

export const createOrUpdateUser = async (userData, tokens) => {
    const { email, name, picture } = userData;
    const { expiry_date, refresh_token, access_token } = tokens;

    let user = await User.findOne({ email });

    if (user) {
        user.name = name;
        user.picture = picture;
        user.googleTokens = {
            expiryDate: expiry_date,
            refreshToken: refresh_token,
            accessToken: access_token,
        };
        await user.save();
    } else {
        user = new User({
            email,
            name,
            picture,
            googleTokens: {
                expiryDate: expiry_date,
                refreshToken: refresh_token,
                accessToken: access_token,
            },
        });
        await user.save();
    }

    return user;
};