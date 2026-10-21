const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateAdminName() {
  try {
    const admin = await prisma.user.findFirst({
      where: { email: 'admin@example.com' } // Assuming this is the admin email
    });
    
    if (admin) {
      await prisma.user.update({
        where: { id: admin.id },
        data: { name: 'Store Admin' }
      });
      console.log('Successfully updated Admin name to Store Admin.');
    } else {
      console.log('Admin user not found. Trying to find by role ADMIN...');
      const roleAdmin = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
      });
      if (roleAdmin) {
         await prisma.user.update({
          where: { id: roleAdmin.id },
          data: { name: 'Store Admin' }
        });
        console.log('Successfully updated Admin name to Store Admin via Role.');
      }
    }
  } catch (error) {
    console.error('Error updating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminName();
