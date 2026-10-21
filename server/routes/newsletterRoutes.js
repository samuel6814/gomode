const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    // Upsert: Create if it doesn't exist, just return it if it does
    const subscriber = await prisma.subscriber.upsert({
      where: { email },
      update: { isActive: true },
      create: { email }
    });

    res.status(200).json({ success: true, message: 'Successfully subscribed!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Subscription failed' });
  }
});

module.exports = router;