const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload multiple files to Cloudinary
 * @param {Array} files - array of file buffers
 * @param {String} projectFolder - folder name per project
 * @returns {Array} - array of uploaded image URLs
 */
const uploadImages = async (files, projectFolder = process.env.PROJECT_NAME || "defaultProject") => {
  try {
    const uploadPromises = files.map(file =>
      new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: `${projectFolder}/products`,
            width: 800,       // resize width
            height: 800,      // resize height
            crop: "limit",    // maintain aspect ratio
            quality: "auto",  // automatic compression
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url); // return Cloudinary URL
          }
        ).end(file.buffer);
      })
    );

    const uploadedUrls = await Promise.all(uploadPromises);
    return uploadedUrls;

  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload images");
  }
};

module.exports = uploadImages;
