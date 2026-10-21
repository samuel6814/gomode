const cron = require('node-cron');
const prisma = require('../lib/prisma');

// Function to compute and store dashboard statistics
const computeDashboardStats = async () => {
  try {
    console.log('⏳ [CRON] Computing Dashboard Statistics...');

    // Run the heavy aggregate queries that used to be requested live
    const [metrics, activeFulfillmentResult, completedOrdersResult, totalCount] = await Promise.all([
      prisma.order.aggregate({
        where: { isArchived: false, status: { not: 'CANCELLED' } },
        _sum: { totalAmount: true },
        _count: true
      }),
      prisma.order.count({
        where: { isArchived: false, status: { in: ['PROCESSING', 'PENDING'] } }
      }),
      prisma.order.count({
        where: { isArchived: false, status: 'DELIVERED' }
      }),
      prisma.order.count({ where: { isArchived: false } })
    ]);

    const totalRevenue = metrics._sum.totalAmount || 0;
    const validOrdersCount = metrics._count || 0;
    const activeFulfillment = activeFulfillmentResult;
    const completedOrders = completedOrdersResult;

    // Upsert the results into the new DashboardStats table
    await prisma.dashboardStats.upsert({
      where: { id: 'singleton' },
      update: {
        totalRevenue,
        validOrdersCount,
        activeFulfillment,
        completedOrders,
        totalCount
      },
      create: {
        id: 'singleton',
        totalRevenue,
        validOrdersCount,
        activeFulfillment,
        completedOrders,
        totalCount
      }
    });

    console.log('✅ [CRON] Dashboard Statistics cached successfully!');
  } catch (error) {
    console.error('❌ [CRON] Failed to compute dashboard stats:', error);
    throw error;
  }
};

// Initialize Cron Job
const initCronJobs = () => {
  // Run on startup to ensure we have initial data
  computeDashboardStats().catch(() => {});

  // Render runs this on its own cron service. Local dev keeps the timer.
  if (process.env.RENDER === 'true') return;

  cron.schedule('*/5 * * * *', () => {
    computeDashboardStats();
  });
};

module.exports = { initCronJobs, computeDashboardStats };
