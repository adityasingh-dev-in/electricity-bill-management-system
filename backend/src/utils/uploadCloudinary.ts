import { v2 as cloudinary, UploadApiResponse, UploadApiOptions } from 'cloudinary';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import dotenv from 'dotenv';
import { ApiError } from './ApiError';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Uploads a file to Cloudinary with customizable options
 * @param localFilePath Path to the local file
 * @param folder Optional folder name in Cloudinary (defaults to "e-commerce")
 * @param options Optional Cloudinary upload options (overrides defaults)
 */
const uploadOnCloudinary = async (
    localFilePath: string,
    folder: string = "e-commerce",
    options: UploadApiOptions = {}
): Promise<UploadApiResponse | null> => {
    try {
        if (!localFilePath) return null;
        if (!existsSync(localFilePath)) {
            console.error("File does not exist at path:", localFilePath);
            return null;
        }

        // Default options
        const defaultOptions: UploadApiOptions = {
            folder: folder,
            resource_type: "auto",
            quality: "auto",
            fetch_format: "auto",
        };

        // Merge defaults with provided options
        // options taking precedence
        const uploadOptions = { ...defaultOptions, ...options };

        const response = await cloudinary.uploader.upload(localFilePath, uploadOptions);

        // File has been uploaded successfully
        if (existsSync(localFilePath)) {
            await fs.unlink(localFilePath);
        }
        return response;

    } catch (error) {
        if (existsSync(localFilePath)) {
            try {
                await fs.unlink(localFilePath);
            } catch (unlinkError) {
                console.error("Critical: Failed to delete local file after upload error", unlinkError);
            }
        }
        console.error("Cloudinary Upload Error:", error);
        return null;
    }
};

export { uploadOnCloudinary };