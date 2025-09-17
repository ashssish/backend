import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

//  Load .env variables
dotenv.config();

//  Ensure environment variables are loaded
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error("Cloudinary environment variables are not set.");
}

//  Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//  Upload Function
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    //  Remove local file after upload
    fs.unlinkSync(localFilePath);

    //  Return full Cloudinary response
    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    //  Clean up the file even if upload fails
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

export { uploadOnCloudinary };
