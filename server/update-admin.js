const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('better-auth/crypto');

const prisma = new PrismaClient();

async function main() {
  console.log('Updating admin...');

  const email = 'admin@example.com';
  const adminPassword = await hashPassword('change-me-on-first-login');

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash: adminPassword,
      role: 'ADMIN',
      name: 'Store Admin',
    },
    create: {
      email,
      name: 'Store Admin',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });

  const existingAccount = await prisma.account.findFirst({
    where: { userId: admin.id, providerId: 'credential' },
  });

  if (existingAccount) {
    await prisma.account.update({
      where: { id: existingAccount.id },
      data: { password: adminPassword },
    });
  } else {
    await prisma.account.create({
      data: {
        accountId: admin.id,
        providerId: 'credential',
        userId: admin.id,
        password: adminPassword,
      },
    });
  }

  console.log(`Admin user updated/created: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error('Update failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
