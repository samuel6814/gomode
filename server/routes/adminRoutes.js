const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { isAdmin } = require('../middleware/auth');

// --- POST: Upload an Image ---
// We use the 'isAdmin' middleware to ensure only logged-in admins can upload.
// 'upload.single("image")' tells Multer to look for a file named "image" in the request.
router.post('/upload', isAdmin, upload.single('image'), async (req, res) => {
  try {
    // If Multer and Cloudinary succeed, the file info is attached to req.file
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    // Return the secure Cloudinary URL to the client
    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: req.file.path,
      publicId: req.file.filename // Cloudinary's unique ID for the image
    });

  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ success: false, message: 'Image upload failed' });
  }
});

module.exports = router;