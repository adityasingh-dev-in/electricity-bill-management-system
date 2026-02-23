import User from "../models/user.model";

export const generateBothToken = async (userId: string) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    // Methods defined in the User Schema
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Persist refresh token in DB to enable token rotation/revocation
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
};