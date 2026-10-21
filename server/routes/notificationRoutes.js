const express = require('express');
const router = express.Router();

const { isAdmin } = require('../middleware/auth');
const prisma = require('../lib/prisma');

// --- 1. GET UNREAD NOTIFICATIONS ---
router.get('/unread', isAdmin, async (req, res) => {
  try {
    const unreadOrders = await prisma.order.findMany({
      where: { isNotificationRead: false }, // Only grab unread ones
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } }
    });
    res.status(200).json({ success: true, data: unreadOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
});

// --- 2. MARK NOTIFICATION AS READ ---
router.put('/mark-read/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.order.update({
      where: { id },
      data: { isNotificationRead: true } // Flip the flag so it disappears
    });
    res.status(200).json({ success: true, message: 'Notification cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to clear notification' });
  }
});

// --- 3. SETTINGS: AUTOMATIONS TOGGLE (From earlier) ---
router.put('/automations', isAdmin, async (req, res) => {
  try {
    const { orderConfirmation, shippingUpdate, upcomingDrops } = req.body;
    const configs = [
      { key: 'NOTIFY_ORDER_CONFIRMATION', value: String(orderConfirmation) },
      { key: 'NOTIFY_SHIPPING_UPDATE', value: String(shippingUpdate) },
      { key: 'NOTIFY_UPCOMING_DROPS', value: String(upcomingDrops) }
    ];

    await prisma.$transaction(
      configs.map(config => prisma.storeConfig.upsert({
        where: { key: config.key },
        update: { value: config.value },
        create: { key: config.key, value: config.value }
      }))
    );
    res.status(200).json({ success: true, message: 'Automations updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update automations' });
  }
});

module.exports = router;