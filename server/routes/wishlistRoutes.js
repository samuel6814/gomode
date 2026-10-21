const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../middleware/auth');
const prisma = require('../lib/prisma');
const { getPrismaWithUser } = require('../lib/prisma');

const getDb = (req) => req.user ? getPrismaWithUser(req.user.id, req.user.role) : prisma;

// Get User's Wishlist
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const db = getDb(req);
    const wishlist = await db.wishlist.findMany({
      where: { userId: req.user.id },
      include: { 
        product: {
          include: {
            images: { include: { image: true } }
          }
        } 
      }
    });
    res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch wishlist' });
  }
});

// Add/Remove from Wishlist (Toggle)
router.post('/:productId', isAuthenticated, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const db = getDb(req);

    // Check if it already exists
    const existing = await db.wishlist.findUnique({
      where: { userId_productId: { userId, productId } }
    });

    if (existing) {
      // If it exists, remove it (Unlike)
      await db.wishlist.delete({ where: { id: existing.id } });
      return res.status(200).json({ success: true, message: 'Removed from wishlist' });
    } else {
      // If it doesn't exist, add it (Like)
      const newItem = await db.wishlist.create({
        data: { userId, productId }
      });
      return res.status(201).json({ success: true, message: 'Added to wishlist', data: newItem });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update wishlist' });
  }
});

module.exports = router;