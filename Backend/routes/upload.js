const router = require("express").Router();
const multer = require("multer");
const { uploadImage, uploadVideo } = require("../utils/cloudinaryUploader");

const upload = multer({ storage: multer.memoryStorage() });

/* ===========================
   📌 Upload Thumbnail
=========================== */
router.post("/image", upload.single("thumbnail"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file" });

    const result = await uploadImage(req.file.buffer);
    res.json({ success: true, url: result.secure_url, public_id: result.public_id });

  } catch (err) {
    console.log("Image Upload Error:", err);
    res.status(500).json({ success: false, message: "Image upload failed" });
  }
});

/* ===========================
   📌 Upload Video
=========================== */
router.post("/video", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No video" });

    const result = await uploadVideo(req.file.buffer);
    res.json({ success: true, url: result.secure_url, public_id: result.public_id });

  } catch (err) {
    console.log("Video Upload Error:", err);
    res.status(500).json({ success: false, message: "Video upload failed" });
  }
});

module.exports = router;
