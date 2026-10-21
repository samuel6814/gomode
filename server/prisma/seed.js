const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('better-auth/crypto');

const prisma = new PrismaClient();

const ITEMS_DIR = path.join(__dirname, '../../client/public/new-items');

const CATEGORIES = [
  { name: 'Clothing', description: 'Shirts, knits, pants, and outerwear' },
  { name: 'Denim', description: 'Jeans in loose, relaxed, and baggy fits' },
  { name: 'Shoes', description: 'Dress shoes' },
  { name: 'Accessories', description: 'Bags, belts, and hats' },
];

const PRODUCTS = [
  {
    file: 'regular fit shirt.avif',
    name: 'Regular Fit Corduroy Long-Sleeve Shirt',
    description: 'A versatile, classic regular fit shirt crafted from soft, durable corduroy. Perfect for layering over a tee or wearing buttoned up during cooler months. Features a standard collar, button-up front, and a single chest patch pocket.',
    category: 'Clothing',
    price: 45,
    colors: ['Olive Green', 'Navy Blue', 'Camel', 'Burgundy'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    file: 'Plain Knitted poloPlain Knitted polo.avif',
    name: 'Textured Wool-Blend Knitted Polo Sweater',
    description: 'Elevate your smart-casual wardrobe with this long-sleeve knitted polo. Made from a cozy, textured wool-blend, it features a classic spread collar with a neat 3-button placket and ribbed cuffs and hem for a perfect fit.',
    category: 'Clothing',
    price: 60,
    colors: ['Heather Brown', 'Charcoal Grey', 'Navy', 'Oatmeal'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    file: 'Plain Knitted polo.avif',
    name: 'Argyle Pattern Knit Cardigan Polo',
    description: 'Make a bold statement with this striking argyle pattern knit cardigan. Featuring a full button-down front, polo-style collar, and a comfortable relaxed fit. Ideal for adding a touch of retro sophistication to any outfit.',
    category: 'Clothing',
    price: 65,
    colors: ['Camel/Black Argyle', 'Grey/Navy Argyle'],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    file: 'collar-knit-cardigan.png',
    name: 'Brushed Collar Knit Cardigan',
    description: 'A soft brushed knit cardigan with a shirt collar and dark buttons, worn open over a cream shirt. Relaxed through the body, with ribbed hem and cuffs that sit easily over dark denim.',
    category: 'Clothing',
    price: 85,
    colors: ['Olive', 'Cream'],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    file: 'pocket-vneck-cardigan.png',
    name: 'Relaxed V-Neck Pocket Cardigan',
    description: 'A relaxed brown knit cardigan with a deep v-neck, ribbed trims, and two patch pockets. Layered over a checked shirt for a softer take on tailoring.',
    category: 'Clothing',
    price: 90,
    colors: ['Brown', 'Burgundy'],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    file: 'Perry-Ellis-mens-Textured-Polo-Sweater-Cabernet.webp',
    name: "Perry Ellis Men's Textured Short-Sleeve Polo Sweater",
    description: 'A sophisticated short-sleeve polo sweater featuring a subtle geometric textured knit pattern. The rich coloring and premium stretch fabric make it ideal for transitioning seamlessly from the office to the weekend.',
    category: 'Clothing',
    price: 55,
    colors: ['Cabernet', 'Midnight Blue', 'Forest Green', 'Slate Grey'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    file: 'Perry-Ellis-mens-Slim-Fit-TENCEL-5-Pocket-Pant-Dark-Sapphire_7153fd2f.webp',
    name: "Perry Ellis Men's Slim Fit TENCEL™ 5-Pocket Pant",
    description: 'Sleek, lightweight, and exceptionally comfortable, these slim-fit 5-pocket pants are crafted with an eco-friendly TENCEL™ blend fabric. They offer ultimate softness and slight stretch, serving as a modern, refined alternative to classic denim.',
    category: 'Clothing',
    price: 75,
    colors: ['Dark Sapphire', 'True Black', 'Khaki', 'Stone'],
    sizes: ['30x30', '32x30', '32x32', '34x32', '36x32', '38x34'],
  },
  {
    file: 'Perry-Ellis-mens-Cool-Interlock-Tee-Reef-Waters-PS.webp',
    name: "Perry Ellis Men's Cool Interlock Performance Tee",
    description: 'Upgrade your basics with this everyday t-shirt. The Cool Interlock Tee offers moisture-wicking properties and a smooth, soft finish. Cut for a modern fit that drapes perfectly and retains its shape wash after wash.',
    category: 'Clothing',
    price: 30,
    colors: ['Reef Waters Blue', 'Optic White', 'True Black', 'Heather Grey'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    file: 'Bomber jacket.avif',
    name: 'Classic Leather Aviator Bomber Jacket',
    description: 'Infuse your wardrobe with rugged edge. This premium faux-leather bomber jacket features a striking contrast faux-shearling collar, a smooth zip-up front, and ribbed hem and cuffs to keep the cold out and the style locked in.',
    category: 'Clothing',
    price: 110,
    colors: ['Black w/ Cream Collar', 'Brown w/ Cream Collar'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    file: 'JJIEDDIE JJBASIC SQ 738 NOOS Loose fit jeans.avif',
    name: 'JJIEDDIE JJBASIC Loose Fit Light Wash Jeans',
    description: 'Channel a relaxed, 90s-inspired retro vibe with the JJIEDDIE loose fit jeans. Crafted from sturdy, non-stretch light-wash denim, featuring a classic 5-pocket design, standard rise, and a spacious, relaxed fit all the way through the leg.',
    category: 'Denim',
    price: 50,
    colors: ['Light Blue Wash', 'Vintage Indigo', 'Bleached White'],
    sizes: ['28x30', '30x32', '32x32', '34x32', '36x34'],
  },
  {
    file: 'JJICHRIS JJORIGINAL SQ 071 Relaxed Fit Jeans.avif',
    name: 'JJICHRIS JJORIGINAL Relaxed Fit Everyday Jeans',
    description: 'The ultimate everyday denim. These relaxed fit jeans offer a comfortable mid-rise waist and a straight leg. Washed down to a versatile medium blue with subtle fading, providing a naturally lived-in look right out of the box.',
    category: 'Denim',
    price: 55,
    colors: ['Medium Blue Wash', 'Dark Wash', 'Stone Wash'],
    sizes: ['30x30', '32x30', '32x32', '34x32', '36x32', '38x32'],
  },
  {
    file: 'JJIALEX JJORIGINAL SBD 306 NOOS Baggy fit jeans.avif',
    name: 'JJIALEX JJORIGINAL Baggy Fit Black Jeans',
    description: 'Embrace maximum comfort and contemporary street style with the JJIALEX baggy fit jeans. Featuring a slightly dropped crotch, a wide leg profile, and classic black denim construction that pairs effortlessly with chunky sneakers and knitwear.',
    category: 'Denim',
    price: 60,
    colors: ['Black', 'Faded Black', 'Raw Indigo'],
    sizes: ['28x30', '30x30', '32x32', '34x32', '36x32'],
  },
  {
    file: 'Perry-Ellis-mens-Gatsby-Dress-Shoe-Black_6ef83567.webp',
    name: "Perry Ellis Men's Gatsby Patent Dress Shoe",
    description: 'Step into elegance with the Gatsby Dress Shoe. Featuring a high-shine patent leather finish, classic lace-up closure, and a sleek oxford silhouette. The perfect finishing touch for formal events, galas, and weddings.',
    category: 'Shoes',
    price: 95,
    colors: ['Black Patent', 'Matte Black Leather'],
    sizes: ['7', '8', '9', '9.5', '10', '10.5', '11', '12', '13'],
  },
  {
    file: 'jackjones-jacpascalbackpackln-black.avif',
    name: 'Jack & Jones Pascal Canvas Commuter Backpack',
    description: 'A durable, utilitarian-inspired black canvas backpack featuring contrasting faux-leather carrying handles and base trim. Designed with a roomy main compartment, a secure front zippered pouch, and adjustable straps for daily commuting or weekend getaways.',
    category: 'Accessories',
    price: 45,
    colors: ['Black', 'Olive Green', 'Navy Blue'],
    sizes: ['One Size'],
  },
  {
    file: 'backpack.avif',
    name: 'Minimalist Faux-Leather City Backpack',
    description: 'Sleek and sophisticated, this minimalist backpack is constructed from smooth, rich brown faux-leather. It features clean lines, a discreet front slip pocket, a secure dual-zip main compartment, and lightly padded straps, making it an excellent choice for a modern smart-casual look.',
    category: 'Accessories',
    price: 65,
    colors: ['Brown', 'Black'],
    sizes: ['One Size'],
  },
  {
    file: 'belt.avif',
    name: 'Jack & Jones Embossed Leather Belt',
    description: 'A reliable, sturdy everyday belt crafted from textured faux-leather. It boasts an antique-finish silver-tone buckle and features a bold, debossed Jack & Jones logo text along the strap. Perfect for holding up your favorite relaxed or baggy denim.',
    category: 'Accessories',
    price: 25,
    colors: ['Black', 'Cognac Brown'],
    sizes: ['30', '32', '34', '36', '38', '40', '42'],
  },
  {
    file: 'Beanie.avif',
    name: 'Classic Ribbed Knit Beanie',
    description: 'An essential cold-weather staple. This beanie is knit from a soft, warm acrylic blend with a classic ribbed texture and a versatile fold-over cuff. It pairs perfectly with heavy outerwear like sherpa fleeces and oversized coats.',
    category: 'Accessories',
    price: 18,
    colors: ['Forest Green', 'Black', 'Charcoal Grey', 'Mustard Yellow'],
    sizes: ['One Size'],
  },
];

const DELIVERY_FEES = [
  { region: 'Greater Accra', city: 'Accra', fee: 25 },
  { region: 'Greater Accra', city: null, fee: 35 },
  { region: 'Ashanti', city: 'Kumasi', fee: 45 },
  { region: 'Ashanti', city: null, fee: 55 },
];

function imageUrl(filename) {
  return `/new-items/${encodeURIComponent(filename)}`;
}

async function clearCatalog() {
  await prisma.cartItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.image.deleteMany();
}

async function upsertDeliveryFee({ region, city, fee }) {
  const existing = await prisma.deliveryFee.findFirst({ where: { region, city } });
  if (existing) {
    return prisma.deliveryFee.update({
      where: { id: existing.id },
      data: { fee, isActive: true },
    });
  }
  return prisma.deliveryFee.create({
    data: { region, city, fee, isActive: true },
  });
}

async function main() {
  for (const product of PRODUCTS) {
    const filePath = path.join(ITEMS_DIR, product.file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Missing catalog image: ${product.file}`);
    }
  }

  console.log('Clearing catalog...');
  await clearCatalog();

  const adminPassword = await hashPassword('change-me-on-first-login');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { passwordHash: adminPassword, role: 'ADMIN', name: 'buyy' },
    create: {
      email: 'admin@example.com',
      name: 'buyy',
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

  const storePassword = await hashPassword('admin');
  const storeAdmin = await prisma.user.upsert({
    where: { email: 'admin@buyy.com' },
    update: { passwordHash: storePassword, role: 'ADMIN', name: 'buyy' },
    create: {
      email: 'admin@buyy.com',
      name: 'buyy',
      passwordHash: storePassword,
      role: 'ADMIN',
    },
  });
  const storeAccount = await prisma.account.findFirst({
    where: { userId: storeAdmin.id, providerId: 'credential' },
  });
  if (storeAccount) {
    await prisma.account.update({
      where: { id: storeAccount.id },
      data: { password: storePassword },
    });
  } else {
    await prisma.account.create({
      data: {
        accountId: storeAdmin.id,
        providerId: 'credential',
        userId: storeAdmin.id,
        password: storePassword,
      },
    });
  }

  const categories = {};
  for (const category of CATEGORIES) {
    categories[category.name] = await prisma.category.create({
      data: { name: category.name, description: category.description, status: 'ACTIVE' },
    });
  }

  for (const product of PRODUCTS) {
    const publicId = `catalog/${product.file}`;
    const format = path.extname(product.file).slice(1);
    await prisma.image.create({
      data: {
        url: imageUrl(product.file),
        public_id: publicId,
        filename: product.file,
        format,
        tags: 'fashion,seed',
      },
    });
    await prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: 12,
        categoryId: categories[product.category].id,
        isActive: true,
        colors: product.colors,
        tags: ['buyy', ...product.sizes.map((size) => `size:${size}`)],
        images: {
          create: [{ isPrimary: true, image: { connect: { public_id: publicId } } }],
        },
      },
    });
    console.log(`  ${product.name}`);
  }

  const galleryItems = PRODUCTS.map((product, index) => ({
    id: `seed-gallery-${index}`,
    title: product.name,
    caption: product.category,
    image: { url: imageUrl(product.file), public_id: `catalog/${product.file}` },
    isFeatured: index < 4,
    sortOrder: index,
  }));

  const heroConfigData = {
    eyebrow: 'buyy',
    headline: 'Shopping',
    headlineItalic: 'designed',
    headlineEnd: 'around you',
    description: 'Shopping designed around you. Browse fashion in the catalog and check out in Ghana cedis.',
    ctaPrimary: { text: 'Shop', href: '/shop' },
    ctaSecondary: { text: 'About', href: '/about' },
  };

  await prisma.storeConfig.upsert({
    where: { key: 'HERO_SECTION' },
    update: { value: JSON.stringify(heroConfigData) },
    create: { key: 'HERO_SECTION', value: JSON.stringify(heroConfigData) },
  });
  await prisma.storeConfig.upsert({
    where: { key: 'GALLERY_SECTION' },
    update: { value: JSON.stringify({ title: 'Gallery', subtitle: 'Fashion from the catalog.', items: galleryItems }) },
    create: {
      key: 'GALLERY_SECTION',
      value: JSON.stringify({ title: 'Gallery', subtitle: 'Fashion from the catalog.', items: galleryItems }),
    },
  });

  for (const fee of DELIVERY_FEES) {
    await upsertDeliveryFee(fee);
  }

  const saleNames = [
    'Classic Leather Aviator Bomber Jacket',
    'JJIALEX JJORIGINAL Baggy Fit Black Jeans',
    "Perry Ellis Men's Gatsby Patent Dress Shoe",
    'Minimalist Faux-Leather City Backpack',
    'Textured Wool-Blend Knitted Polo Sweater',
  ];
  const saleProducts = await prisma.product.findMany({ where: { name: { in: saleNames } }, select: { id: true, name: true } });
  const saleIds = saleNames.map((name) => saleProducts.find((product) => product.name === name)?.id).filter(Boolean);
  await prisma.storeConfig.upsert({
    where: { key: 'SALES_SECTION' },
    update: {
      value: JSON.stringify({
        discountPercent: 45,
        endsAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        productIds: saleIds,
      }),
    },
    create: {
      key: 'SALES_SECTION',
      value: JSON.stringify({
        discountPercent: 45,
        endsAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        productIds: saleIds,
      }),
    },
  });

  console.log(`Catalog ready: ${CATEGORIES.length} categories, ${PRODUCTS.length} products`);
}

main()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
