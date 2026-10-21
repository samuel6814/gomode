const prisma = require('../lib/prisma');
const { computeDashboardStats } = require('./dashboardCron');

computeDashboardStats()
  .then(() => prisma.$disconnect())
  .then(() => process.exit(0))
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect().catch(() => {});
    process.exit(1);
  });
