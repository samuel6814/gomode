const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/auth');
const prisma = require('../lib/prisma');

const DEFAULT_GALLERY = {
  title: 'Gallery',
  subtitle: 'Graphite portraits and pencil studies',
  items: [],
};

router.get('/gallery', async (req, res) => {
  try {
    const config = await prisma.storeConfig.findUnique({
      where: { key: 'GALLERY_SECTION' },
    });

    if (!config) {
      return res.status(200).json({ success: true, data: DEFAULT_GALLERY });
    }

    res.status(200).json({ success: true, data: JSON.parse(config.value) });
  } catch (error) {
    console.error('Fetch Gallery Config Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch gallery configuration' });
  }
});

router.put('/gallery', isAdmin, async (req, res) => {
  try {
    const galleryData = req.body;

    const updatedConfig = await prisma.storeConfig.upsert({
      where: { key: 'GALLERY_SECTION' },
      update: { value: JSON.stringify(galleryData) },
      create: { key: 'GALLERY_SECTION', value: JSON.stringify(galleryData) },
    });

    res.status(200).json({
      success: true,
      message: 'Gallery updated successfully!',
      data: JSON.parse(updatedConfig.value),
    });
  } catch (error) {
    console.error('Update Gallery Config Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update gallery configuration' });
  }
});

module.exports = router;
