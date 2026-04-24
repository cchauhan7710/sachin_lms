const cloudinary = require("../cloudinary");
const streamifier = require("streamifier");

exports.uploadImage = (fileBuffer, folder = "course_thumbnails") => {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        folder,
        transformation: [
          { width: 1200, crop: "limit" },  // prevent heavy images
          { quality: "auto" }              // auto compression
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(upload);
  });
};

exports.uploadVideo = (fileBuffer, folder = "course_videos") => {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        resource_type: "video",
        folder,
        chunk_size: 6000000,
        eager: [
          { format: "mp4", quality: "auto" },  // auto compress
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(upload);
  });
};

// Delete a file by public ID
exports.deleteFile = async (publicId, resourceType = "image") => {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};
