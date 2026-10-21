const express = require('express');
const router = express.Router();

const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { sendEmail } = require('../utils/mailer');

const prisma = require('../lib/prisma');
const { fetchCjTracking } = require('../lib/cjOrders');
const { getPrismaWithUser } = require('../lib/prisma');

const getDb = (req) => (req.user && req.user.role !== 'ADMIN') ? getPrismaWithUser(req.user.id, req.user.role) : prisma;

// --- 1. ADMIN: GET ORDER DASHBOARD & METRICS ---
router.get('/dashboard', isAdmin, async (req, res) => {
  try {
    const db = getDb(req);
    const [cachedStats, orders] = await Promise.all([
      db.dashboardStats.findUnique({ where: { id: 'singleton' } }),
      db.order.findMany({
        where: { isArchived: false },
        include: { user: { select: { name: true, email: true } }, shippingAddress: true }, 
        orderBy: { createdAt: 'desc' },
        take: 50 // Paginate
      })
    ]);

    // Fallback if cron hasn't run yet
    const stats = cachedStats || {
      totalRevenue: 0,
      validOrdersCount: 0,
      activeFulfillment: 0,
      completedOrders: 0,
      totalCount: 0
    };

    const avgOrderValue = stats.validOrdersCount > 0 ? (stats.totalRevenue / stats.validOrdersCount) : 0;
    const completionRate = stats.totalCount > 0 ? ((stats.completedOrders / stats.totalCount) * 100).toFixed(1) : 0;

    res.status(200).json({
      success: true,
      metrics: {
        totalRevenue: stats.totalRevenue.toFixed(2),
        activeFulfillment: stats.activeFulfillment,
        avgOrderValue: avgOrderValue.toFixed(2),
        completionRate: `${completionRate}%`,
        weeklyGoal: "85%",   
        adminTasks: "12 Due" 
      },
      data: orders 
    });
  } catch (error) {
    console.error('Fetch Dashboard Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard metrics' });
  }
});
  
router.get('/track', async (req, res) => {
  try {
    const orderNumber = String(req.query.orderNumber || '').trim().toUpperCase();
    const email = String(req.query.email || '').trim().toLowerCase();
    if (!orderNumber || !email) {
      return res.status(400).json({ success: false, message: 'Order number and email are required' });
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true, shippingAddress: true },
    });
    const matches = order?.shippingAddress?.email?.trim().toLowerCase() === email;
    if (!order || !matches) {
      return res.status(404).json({ success: false, message: 'No order matches that number and email' });
    }

    let tracked = order;
    if (order.cjOrderId) {
      try {
        const tracking = await fetchCjTracking(order.cjOrderId);
        if (tracking.number) {
          const firstTime = !order.trackingEmailed;
          tracked = await prisma.order.update({
            where: { id: order.id },
            data: {
              trackingNumber: tracking.number,
              trackingUrl: tracking.url || order.trackingUrl,
              trackingEmailed: true,
            },
            include: { items: true, shippingAddress: true },
          });
          if (firstTime && order.shippingAddress?.email) {
            const link = tracking.url ? `<p><a href="${tracking.url}">Track the parcel</a></p>` : '';
            const html = `<p>Your buyy order ${order.orderNumber} is on the way.</p><p>Tracking number: ${tracking.number}</p>${link}`;
            sendEmail(order.shippingAddress.email, `Tracking for ${order.orderNumber}`, html).catch((error) => {
              console.error('Tracking email failed:', error.message);
            });
          }
        }
      } catch (error) {
        console.error('CJ tracking refresh failed:', error.message);
      }
    }

    res.status(200).json({
      success: true,
      data: {
        orderNumber: tracked.orderNumber,
        status: tracked.status,
        paymentStatus: tracked.paymentStatus,
        totalAmount: tracked.totalAmount,
        createdAt: tracked.createdAt,
        trackingNumber: tracked.trackingNumber || null,
        trackingUrl: tracked.trackingUrl || null,
        items: tracked.items.map((item) => ({
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
          source: item.source,
        })),
      },
    });
  } catch (error) {
    console.error('Track Order Error:', error);
    res.status(500).json({ success: false, message: 'Failed to look up the order' });
  }
});

// --- 2. ADMIN/USER: GET SINGLE ORDER DETAILS ---
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    
    const db = getDb(req);
    // Changed to findFirst so we can filter out archived orders
    const order = await db.order.findFirst({
      where: { 
        id: id,
        isArchived: false // 🚨 Prevent viewing archived orders
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  include: { image: true }
                }
              }
            }
          }
        },
        shippingAddress: true,
        user: { select: { name: true, email: true } }
      }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (req.user.role !== 'ADMIN' && order.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to this order' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('Fetch Order Detail Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order details' });
  }
});

// --- 3. LEGACY CHECKOUT (DEPRECATED) ---
// This route is replaced by the Paystack payment flow:
//   POST /api/payments/initialize → POST /api/payments/verify
router.post('/checkout', isAuthenticated, async (req, res) => {
  res.status(410).json({
    success: false,
    message: 'This checkout endpoint has been deprecated. Please use /api/payments/initialize to start a payment.'
  });
});

// --- 4. GET USER'S ORDER HISTORY ---
router.get('/my-orders', isAuthenticated, async (req, res) => {
  try {
    const db = getDb(req);
    const orders = await db.order.findMany({
      where: { 
        userId: req.user.id,
        isArchived: false // 🚨 Hides archived orders from the customer
      },
      orderBy: { createdAt: 'desc' } 
    });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

// --- 5. GET ALL ORDERS (Admin Only Dashboard) ---
router.get('/all', isAdmin, async (req, res) => {
  try {
    const db = getDb(req);
    const orders = await db.order.findMany({
      where: { isArchived: false }, // 🚨 Hides archived orders from lists
      include: { user: { select: { name: true, email: true } } }, 
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch all orders' });
  }
});

// --- 6. UPDATE ORDER STATUS (Admin Only) ---
router.put('/:id/status', isAdmin, async (req, res) => {
  try {
    const db = getDb(req);
    const { id } = req.params;
    const { status } = req.body; 

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const updatedOrder = await db.order.update({
      where: { id },
      data: { status }
    });

    res.status(200).json({ 
      success: true, 
      message: `Order marked as ${status}`, 
      data: updatedOrder 
    });
  } catch (error) {
    console.error('Update Order Status Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
});

// --- 7. SOFT DELETE ORDER (Admin Only) ---
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const db = getDb(req);
    await db.order.update({
      where: { id },
      data: { isArchived: true }
    });

    res.status(200).json({ success: true, message: 'Order safely archived' });
  } catch (error) {
    console.error('Archive Order Error:', error);
    res.status(500).json({ success: false, message: 'Failed to archive order' });
  }
});

// --- 8. UPDATE ORDER ADDRESS (Admin Only) ---
router.put('/:id/address', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, street, city, region, country, zipCode } = req.body;

    const db = getDb(req);
    const order = await db.order.findUnique({
      where: { id },
      include: { shippingAddress: true }
    });

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.shippingAddress) {
      await db.shippingAddress.update({
        where: { id: order.shippingAddress.id },
        data: { name, email, phone, street, city, region, country, zipCode }
      });
    } else {
      await db.shippingAddress.create({
        data: {
          orderId: id,
          name, email, phone, street, city, region, country, zipCode
        }
      });
    }

    res.status(200).json({ success: true, message: 'Address updated successfully' });
  } catch (error) {
    console.error('Update Order Address Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update address' });
  }
});

module.exports = router;