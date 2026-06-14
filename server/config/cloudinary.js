// server/config/cloudinary.js

import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import 'dotenv/config';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure local memory storage for incoming file streams
const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    // Return a safe placeholder URL if credentials are not configured
    if (process.env.CLOUDINARY_CLOUD_NAME === "your_cloud_name") {
      console.warn("Cloudinary placeholders detected. Returning safe fallback image URL.");
      const randomId = Math.floor(Math.random() * 1000);
      return resolve(`https://placehold.co/800x600/e2e8f0/64748b?text=Property+Image+${randomId}`);
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};