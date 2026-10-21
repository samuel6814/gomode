const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../middleware/auth'); // Require login for all these routes!

const prisma = require('../lib/prisma');

// ==========================================
// 1. PROFILE SETTINGS
// ==========================================

// GET: Fetch current user profile
router.get('/profile', isAuthenticated, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { 
        id: true, name: true, email: true, createdAt: true,
        phone: true, street: true, city: true, region: true, zipCode: true, country: true
      }
    });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Fetch Profile Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
});

// PUT: Update user profile (Name & Email)
router.put('/profile', isAuthenticated, async (req, res) => {
  try {
    const { name, email, phone, street, city, region, zipCode, country } = req.body;

    // Optional: Check if email is already taken by someone else
    if (email && email !== req.user.email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, email, phone, street, city, region, zipCode, country },
      select: { 
        id: true, name: true, email: true,
        phone: true, street: true, city: true, region: true, zipCode: true, country: true
      }
    });

    res.status(200).json({ success: true, message: 'Profile updated', data: updatedUser });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

// ==========================================
// 2. WISHLIST MANAGEMENT
// ==========================================

// GET: Fetch user's wishlist with product details & images
router.get('/wishlist', isAuthenticated, async (req, res) => {
  try {
    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId: req.user.id },
      include: {
        product: {
          include: {
            images: { include: { image: true } } // Deep fetch to get the Cloudinary URL
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, data: wishlistItems });
  } catch (error) {
    console.error('Fetch Wishlist Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch wishlist' });
  }
});

// POST: Toggle Wishlist (Add if missing, Remove if exists)
router.post('/wishlist/toggle', isAuthenticated, async (req, res) => {
  try {
    const { productId } = req.body;

    // Check if it's already in the wishlist
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: { userId: req.user.id, productId }
      }
    });

    if (existing) {
      // Remove it
      await prisma.wishlist.delete({
        where: { id: existing.id }
      });
      return res.status(200).json({ success: true, message: 'Removed from wishlist', action: 'removed' });
    } else {
      // Add it
      const newItem = await prisma.wishlist.create({
        data: { userId: req.user.id, productId }
      });
      return res.status(200).json({ success: true, message: 'Added to wishlist', action: 'added', data: newItem });
    }
  } catch (error) {
    console.error('Toggle Wishlist Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update wishlist' });
  }
});

// ==========================================
// 3. NOTIFICATIONS (Marketing Preferences)
// ==========================================

// GET: Check if user is subscribed to the newsletter
router.get('/preferences', isAuthenticated, async (req, res) => {
  try {
    const subscriber = await prisma.subscriber.findUnique({
      where: { email: req.user.email }
    });

    const isSubscribed = subscriber ? subscriber.isActive : false;

    res.status(200).json({ success: true, data: { marketingEmails: isSubscribed } });
  } catch (error) {
    console.error('Fetch Preferences Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch preferences' });
  }
});

// PUT: Update newsletter subscription status
router.put('/preferences', isAuthenticated, async (req, res) => {
  try {
    const { marketingEmails } = req.body; 

    await prisma.subscriber.upsert({
      where: { email: req.user.email },
      update: { isActive: marketingEmails },
      create: { email: req.user.email, isActive: marketingEmails }
    });

    res.status(200).json({ success: true, message: 'Preferences updated successfully' });
  } catch (error) {
    console.error('Update Preferences Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update preferences' });
  }
});

// ==========================================
// 4. MY ORDERS
// ==========================================

// GET: Fetch logged-in user's orders
router.get('/orders', isAuthenticated, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        items: {
          include: {
            product: {
              select: { name: true, price: true, images: { take: 1, include: { image: true } } }
            }
          }
        },
        shippingAddress: true
      }
    });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('Fetch User Orders Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

// GET: Fetch a specific order's details (for the invoice/receipt page)
router.get('/orders/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await prisma.order.findFirst({
      where: { 
        id: id, 
        userId: req.user.id // SECURITY: Ensures a user can't pull someone else's order!
      }, 
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { include: { image: true } }
              }
            }
          }
        },
        shippingAddress: true
      }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found or unauthorized' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('Fetch Order Details Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order details' });
  }
});

// ==========================================
// 5. USER NOTIFICATIONS (Derived from orders)
// ==========================================

router.get('/notifications', isAuthenticated, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 10, // Last 10 orders at most
      select: { id: true, status: true, totalAmount: true, createdAt: true }
    });

    // Build notifications from recent order activity
    const notifications = orders.map(order => {
      const statusMessages = {
        PENDING: `Your order #${order.id.slice(-6).toUpperCase()} has been placed and is being processed.`,
        PROCESSING: `Your order #${order.id.slice(-6).toUpperCase()} is being prepared for shipping.`,
        SHIPPED: `Your order #${order.id.slice(-6).toUpperCase()} has been shipped!`,
        DELIVERED: `Your order #${order.id.slice(-6).toUpperCase()} has been delivered.`,
        CANCELLED: `Your order #${order.id.slice(-6).toUpperCase()} was cancelled.`,
      };

      return {
        id: order.id,
        message: statusMessages[order.status] || `Order #${order.id.slice(-6).toUpperCase()} updated.`,
        status: order.status,
        createdAt: order.createdAt
      };
    });

    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error('Fetch User Notifications Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
});

module.exports = router;