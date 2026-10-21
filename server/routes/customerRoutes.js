const express = require('express');
const router = express.Router();

const { isAdmin } = require('../middleware/auth');

const prisma = require('../lib/prisma');

// --- HELPER FUNCTION: Calculate Tier Based on Spend ---
const calculateTier = (spend) => {
  if (spend >= 5000) return 'PLATINUM ELITE';
  if (spend >= 1000) return 'GOLD TIER';
  return 'ASPIRANT';
};

// --- 1. GET ALL CUSTOMERS & AGGREGATE METRICS ---
router.get('/', isAdmin, async (req, res) => {
  try {
    // 1. Fetch Customers and aggregate spending data in parallel
    const [customers, userSpends] = await Promise.all([
      prisma.user.findMany({
        where: { role: 'CUSTOMER' },
        include: { _count: { select: { orders: true } } }, // Only pull counts, not full order objects!
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.groupBy({
        by: ['userId'],
        _sum: { totalAmount: true }
      })
    ]);

    // Create a map of userId to totalSpend for fast O(1) lookups
    const spendMap = {};
    userSpends.forEach(record => {
      spendMap[record.userId] = record._sum.totalAmount || 0;
    });

    let totalRevenue = 0;
    let totalOrders = 0;
    let platinumCount = 0;
    let goldCount = 0;
    let aspirantCount = 0;
    let repeatCustomers = 0;

    // Process each customer to calculate the dashboard stats
    const processedCustomers = customers.map(customer => {
      const orderCount = customer._count.orders;
      const totalSpend = spendMap[customer.id] || 0;
      
      totalRevenue += totalSpend;
      totalOrders += orderCount;
      if (orderCount > 1) repeatCustomers++;

      const tier = calculateTier(totalSpend);
      if (tier === 'PLATINUM ELITE') platinumCount++;
      else if (tier === 'GOLD TIER') goldCount++;
      else aspirantCount++;

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        createdAt: customer.createdAt,
        totalSpend,
        orderCount,
        tier
      };
    });

    // Calculate Dashboard Analytics
    const totalMembers = customers.length;
    const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;
    const repeatPurchaseFreq = totalMembers > 0 ? ((repeatCustomers / totalMembers) * 100).toFixed(1) : 0;

    res.status(200).json({
      success: true,
      analytics: {
        totalDatabaseSize: totalMembers,
        averageOrderValue: avgOrderValue.toFixed(2),
        repeatPurchaseFrequency: `${repeatPurchaseFreq}%`,
        membershipDistribution: {
          platinum: totalMembers ? Math.round((platinumCount / totalMembers) * 100) : 0,
          gold: totalMembers ? Math.round((goldCount / totalMembers) * 100) : 0,
          aspirant: totalMembers ? Math.round((aspirantCount / totalMembers) * 100) : 0,
        }
      },
      data: processedCustomers
    });
  } catch (error) {
    console.error('Fetch Customers Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch customers' });
  }
});

// --- 2. GET ALL NEWSLETTER SUBSCRIBERS ---
router.get('/subscribers', isAdmin, async (req, res) => {
  try {
    const subscribers = await prisma.subscriber.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ success: true, data: subscribers });
  } catch (error) {
    console.error('Fetch Subscribers Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch subscribers' });
  }
});

// --- 3. GET SINGLE CUSTOMER DETAILS (The Deep Dive) ---
router.get('/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [customer, orderAgg, recentOrders] = await Promise.all([
      prisma.user.findUnique({
        where: { id },
        select: { id: true, name: true, email: true, createdAt: true }
      }),
      prisma.order.aggregate({
        where: { userId: id, status: { not: 'CANCELLED' } },
        _sum: { totalAmount: true },
        _count: true
      }),
      prisma.order.findMany({
        where: { userId: id },
        orderBy: { createdAt: 'desc' },
        take: 5 // Only fetch last 5 for history UI
      })
    ]);

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Crunch the numbers for this specific user
    const orderCount = orderAgg._count || 0;
    const totalSpend = orderAgg._sum.totalAmount || 0;
    const avgOrder = orderCount > 0 ? (totalSpend / orderCount) : 0;
    const lastEngagement = recentOrders.length > 0 ? recentOrders[0].createdAt : customer.createdAt;
    
    // Format the response to match your UI perfectly
    const formattedCustomer = {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      telephone: "+233 000 000 0000", // Placeholder until added to DB schema
      memberSince: customer.createdAt,
      status: calculateTier(totalSpend),
      totalSpend: totalSpend.toFixed(2),
      avgOrder: avgOrder.toFixed(2),
      lastEngagement,
      lifetimeValue: totalSpend > 5000 ? 'EXCEPTIONAL' : (totalSpend > 1000 ? 'HIGH' : 'STANDARD'),
      orderHistory: recentOrders,
      preferredCategories: ["Outerwear", "Accessories"], // Placeholder (requires OrderItem schema)
      shippingAddress: { // Placeholder until checkout collects this
        street: "123 Main St",
        city: "Kumasi",
        region: "Ashanti",
        country: "Ghana"
      },
      paymentMethods: [ // Mocked for UI, actual data lives in Paystack
        { brand: "VISA", last4: "4242", expires: "12/26", isPrimary: true }
      ]
    };

    res.status(200).json({ success: true, data: formattedCustomer });
  } catch (error) {
    console.error('Fetch Customer Details Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch customer details' });
  }
});

module.exports = router;