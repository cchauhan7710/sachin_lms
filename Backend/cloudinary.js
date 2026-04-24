const cloudinary = require("cloudinary").v2;

// Cloudinary Configuration (dotenv is already loaded in server.js)
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
  secure: true, // Force HTTPS always
});

module.exports = cloudinary;
