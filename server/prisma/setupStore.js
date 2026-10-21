require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('better-auth/crypto');

const prisma = new PrismaClient();

const SALE_NAMES = [
  'Classic Leather Aviator Bomber Jacket',
  'JJIALEX JJORIGINAL Baggy Fit Black Jeans',
  "Perry Ellis Men's Gatsby Patent Dress Shoe",
  'Minimalist Faux-Leather City Backpack',
  'Textured Wool-Blend Knitted Polo Sweater',
];

async function main() {
  const password = await hashPassword('admin');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@buyy.com' },
    update: { passwordHash: password, role: 'ADMIN', name: 'buyy' },
    create: {
      email: 'admin@buyy.com',
      name: 'buyy',
      passwordHash: password,
      role: 'ADMIN',
    },
  });

  const account = await prisma.account.findFirst({
    where: { userId: admin.id, providerId: 'credential' },
  });
  if (account) {
    await prisma.account.update({ where: { id: account.id }, data: { password } });
  } else {
    await prisma.account.create({
      data: {
        accountId: admin.id,
        providerId: 'credential',
        userId: admin.id,
        password,
      },
    });
  }

  const products = await prisma.product.findMany({ select: { id: true, tags: true, name: true } });
  for (const product of products) {
    if (product.tags.includes('buyy')) continue;
    await prisma.product.update({
      where: { id: product.id },
      data: { tags: ['buyy', ...product.tags] },
    });
  }

  const picked = products.filter((product) => SALE_NAMES.includes(product.name));
  const productIds = SALE_NAMES.map((name) => picked.find((product) => product.name === name)?.id).filter(Boolean);
  const endsAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
  const value = JSON.stringify({ discountPercent: 45, endsAt, productIds });
  await prisma.storeConfig.upsert({
    where: { key: 'SALES_SECTION' },
    update: { value },
    create: { key: 'SALES_SECTION', value },
  });

  console.log(`Updated ${products.length} products, sale covers ${productIds.length} items, ends ${endsAt}`);
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
