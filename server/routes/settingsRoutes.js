const express = require('express');
const router = express.Router();

const { isAdmin } = require('../middleware/auth');
const prisma = require('../lib/prisma');

// --- GET ALL SETTINGS ---
router.get('/', isAdmin, async (req, res) => {
  try {
    const settings = await prisma.storeConfig.findMany();
    // Convert array of objects [{key: 'STORE_NAME', value: 'Your Brand'}] 
    // into a nice simple object: { STORE_NAME: 'Your Brand' } for your React frontend
    const formattedSettings = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
    
    res.status(200).json({ success: true, data: formattedSettings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch settings' });
  }
});

// --- BULK UPDATE SETTINGS ---
router.put('/bulk', isAdmin, async (req, res) => {
  try {
    const settingsObject = req.body; // e.g., { STORE_NAME: "Girly", TAX_RATE: "15" }
    
    // Loop through the object and upsert each key
    for (const [key, value] of Object.entries(settingsObject)) {
      await prisma.storeConfig.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      });
    }

    res.status(200).json({ success: true, message: 'Settings updated successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update settings' });
  }
});

module.exports = router;