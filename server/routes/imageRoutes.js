const express = require('express');
const router = express.Router();

const { isAdmin } = require('../middleware/auth');
const { upload, cloudinary } = require('../config/cloudinary'); 

const prisma = require('../lib/prisma');

// --- 1. GET ALL IMAGES ---
router.get('/', isAdmin, async (req, res) => {
  try {
    const images = await prisma.image.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    res.status(200).json({ 
      success: true, 
      metrics: { totalAssets: images.length },
      data: images 
    });
  } catch (error) {
    console.error('Fetch Images Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch images' });
  }
});

// --- 2. BULK UPLOAD IMAGES (Admin Only) ---
// upload.array('images', 20) allows up to 20 files at once!
router.post('/upload', isAdmin, upload.array('images', 20), async (req, res) => {
  try {
    // 1. Check if files exist
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No image files provided' });
    }

    // 2. Map through all uploaded files and prepare database entries
    const uploadPromises = req.files.map((file) => {
      return prisma.image.create({
        data: {
          url: file.path,             // Cloudinary URL
          public_id: file.filename,   // Cloudinary ID
          format: file.mimetype,      
          size: file.size             
        }
      });
    });

    // 3. Save them all to the database simultaneously
    const newImages = await Promise.all(uploadPromises);

    res.status(201).json({ 
      success: true, 
      message: `Successfully uploaded ${newImages.length} image(s)!`,
      data: newImages 
    });
  } catch (error) {
    console.error('Image Upload Error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload images' });
  }
});

// --- 3. BULK DELETE IMAGES (Admin Only) ---
// Deletes multiple images efficiently
router.post('/bulk-delete', isAdmin, async (req, res) => {
  try {
    const { ids } = req.body; // Expects an array of IDs from the frontend

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'No image IDs provided for deletion' });
    }

    // 1. Find all requested images to get their Cloudinary public_ids
    const images = await prisma.image.findMany({
      where: { id: { in: ids } }
    });

    if (images.length === 0) {
      return res.status(404).json({ success: false, message: 'No matching images found' });
    }

    // 2. Delete all files from Cloudinary concurrently
    const deletePromises = images.map(img => cloudinary.uploader.destroy(img.public_id));
    await Promise.all(deletePromises);

    // 3. Delete all records from the PostgreSQL database in one sweep
    await prisma.image.deleteMany({
      where: { id: { in: ids } }
    });

    res.status(200).json({ success: true, message: `Successfully deleted ${images.length} image(s)` });
  } catch (error) {
    console.error('Bulk Delete Error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete images' });
  }
});

// --- 4. DELETE SINGLE IMAGE (Fallback/Admin Only) ---
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const image = await prisma.image.findUnique({ where: { id } });
    if (!image) return res.status(404).json({ success: false, message: 'Image not found' });

    await cloudinary.uploader.destroy(image.public_id);
    await prisma.image.delete({ where: { id } });

    res.status(200).json({ success: true, message: 'Image deleted' });
  } catch (error) {
    console.error('Delete Image Error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete image' });
  }
});

module.exports = router;