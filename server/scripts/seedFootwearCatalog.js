require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { PrismaClient } = require('@prisma/client');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ITEMS_DIR = path.join(__dirname, '../../client/public/new-items');

// Dynamically load product data from the catalog file
const CATALOG_PATH = path.join(__dirname, '../../product_catalog_data.txt');
let PRODUCTS_DATA = [];
try {
  const raw = fs.readFileSync(CATALOG_PATH, 'utf8');
  const entries = raw.split(/\n\n+/).filter(Boolean);
  PRODUCTS_DATA = entries.map((block) => {
    const lines = block.split('\n');
    const data = {};
    lines.forEach((line) => {
      const [key, ...rest] = line.split(':');
      const value = rest.join(':').trim();
      switch (key.trim()) {
        case 'IDENTIFIER':
          data.identifier = value;
          break;
        case 'NAME':
          data.name = value;
          break;
        case 'DESCRIPTION':
          data.description = value;
          break;
        case 'AVAILABLE COLORS':
          data.colors = value.split(',').map((c) => c.trim());
          break;
        case 'AVAILABLE SIZES':
          // Strip HTML tags if any and split by commas or spaces
          const sizeStr = value.replace(/<[^>]*>/g, '').trim();
          data.sizes = sizeStr.split(/[,\s]+/).filter(Boolean);
          break;
        case 'CATEGORY':
          data.categoryName = value;
          break;
        case 'PRICE':
          data.price = parseInt(value.replace(/[^0-9]/g, ''), 10);
          break;
        case 'MATERIAL':
          data.material = value;
          break;
        case 'STYLE':
          data.style = value;
          break;
        case 'BRAND':
          data.brand = value;
          break;
        default:
          break;
      }
    });
    // Ensure required fields exist
    data.brand = data.brand || 'GoMode';
    return data;
  });
} catch (e) {
  console.error('Failed to load product catalog:', e);
}

PRODUCTS_DATA = [
{
    identifier: 'shoe111.jpg',
    name: 'Nike Shox R4',
    brand: 'Nike',
    description: 'A bold return of an early 2000s icon. This Nike Shox R4 features a premium dark green suede and black leather upper, highlighted by a metallic silver swoosh. The signature four-column Shox system in the heel provides responsive cushioning and unmistakable retro-futuristic style.',
    colors: ['Dark Green', 'Black', 'Metallic Silver'],
    sizes: ["7", "8", "8.5", "9", "9.5", "10", "10.5", "11", "12", "13"],
    categoryName: 'Sneakers',
    material: 'Suede, Leather, and Synthetic upper with rubber outsole',
    style: 'Streetwear, Retro Running',
    price: 1650,
},
  {
    identifier: 'shoe110.jpg',
    name: 'ASICS Gel-Kayano 14',
    brand: 'ASICS',
    description: 'Conveying a new perception to the retro running shape, the GEL-KAYANO 14 resurfaces with its late 2000s aesthetic. Featuring a sleek black mesh base with striking metallic silver overlays, this sneaker utilizes the original tooling with signature GEL technology cushioning for premium all-day comfort.',
    colors: ['Black', 'Metallic Silver'],
    sizes: ["7", "8", "9", "9.5", "10", "10.5", "11", "12"],
    categoryName: 'Sneakers',
    material: 'Mesh and Synthetic Leather',
    style: 'Y2K Runner, Streetwear',
    price: 1450,
  },
  {
    identifier: 'shoe109.jpg',
    name: 'Converse Chuck Taylor All Star High "Gothic Cross" Custom',
    brand: 'Converse (Customized)',
    description: 'A dark, edgy take on the classic Chuck Taylor All Star High Top. This black canvas sneaker features an oversized, heavily embroidered white gothic cross patch on the lateral side, bringing a distinct grunge and luxury-streetwear aesthetic to an iconic silhouette.',
    colors: ['Black', 'White'],
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
    categoryName: 'Sneakers',
    material: 'Canvas upper, Rubber sole',
    style: 'Grunge, Alternative Streetwear',
    price: 1100,
  },
  {
    identifier: 'shoe108.jpg',
    name: 'PUMA Speedcat LS',
    brand: 'PUMA',
    description: 'Born for the track, built for the street. The PUMA Speedcat LS brings motorsport style to your everyday wardrobe. Crafted from rich red suede with a contrasting white leather formstrip and gold-foil PUMA branding, featuring the iconic low-profile rubber outsole that wraps up the heel.',
    colors: ['Ribbon Red', 'Puma White'],
    sizes: ["7", "8", "9", "10", "11", "12"],
    categoryName: 'Sneakers',
    material: 'Suede upper, Rubber outsole',
    style: 'Motorsport, Retro Casual',
    price: 950,
  },
  {
    identifier: 'shoe107.jpg',
    name: 'Birkenstock Boston Soft Footbed Suede Clog',
    brand: 'Birkenstock',
    description: 'The Birkenstock Boston is a versatile classic that can easily be worn all year round. This model features a velvety soft suede leather upper in a rich mustard/mink colorway. It comes equipped with the signature anatomically shaped cork-latex soft footbed for unparalleled support and comfort.',
    colors: ['Mink', 'Mustard Yellow'],
    sizes: ["39", "40", "41", "42", "43", "44", "45", "46"],
    categoryName: 'Clogs & Slip-Ons',
    material: 'Suede leather, Cork-latex footbed, EVA sole',
    style: 'Casual, Loungewear, Everyday',
    price: 1250,
  },
  {
    identifier: 'shoe106.jpg',
    name: 'New Balance 550',
    brand: 'New Balance',
    description: 'The return of a basketball legend. The New Balance 550 pays tribute to the 1989 original that defined a generation of hoops. This clean colorway features a crisp white leather upper with bold forest green accents and a subtle grey suede toe cap, sitting atop a vintage-inspired two-tone sole.',
    colors: ['White', 'Forest Green', 'Grey'],
    sizes: ["7", "8", "8.5", "9", "9.5", "10", "10.5", "11", "12"],
    categoryName: 'Sneakers',
    material: 'Leather and Suede upper, Rubber outsole',
    style: 'Retro Basketball, Everyday Casual',
    price: 1200,
  },
  {
    identifier: 'shoe105.jpg',
    name: 'New Balance 9060',
    brand: 'New Balance',
    description: 'The 9060 is a new expression of the refined style and innovation-led design of the classic 99X series. This chunky, futuristic silhouette features a mesh base overlaid with premium hairy suede in earthy brown and taupe tones. The exaggerated, wavy midsole features ABZORB and SBS cushioning.',
    colors: ['Brown', 'Taupe', 'Mushroom'],
    sizes: ["7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "12"],
    categoryName: 'Sneakers',
    material: 'Suede and Mesh upper, Rubber outsole',
    style: 'Chunky Sneaker, Modern Tech Running',
    price: 1550,
  },
  {
    identifier: 'shoe104.jpg',
    name: "Prada America's Cup Sneaker",
    brand: 'Prada',
    description: "A legendary silhouette in luxury footwear. The Prada America's Cup sneaker is crafted from a dynamic mix of glossy patent leather and breathable technical mesh. Finished with the iconic red Prada Linea Rossa logo stripe down the tongue and an ergonomic rubber sole.",
    colors: ['Black (Nero)'],
    sizes: ["6", "7", "7.5", "8", "8.5", "9", "10", "11"],
    categoryName: 'Sneakers',
    material: 'Patent Leather and Technical Mesh',
    style: 'Luxury Casual, Designer',
    price: 3200,
  },
  {
    identifier: 'shoe103.jpg',
    name: 'Birkenstock Arizona Soft Footbed',
    brand: 'Birkenstock',
    description: 'The often imitated, never duplicated, category-defining, two-strap wonder from Birkenstock. This Arizona sandal features adjustable straps in a versatile mocha synthetic material, paired with the legendary Soft Footbed—featuring an integrated foam layer for immediate, day-one comfort.',
    colors: ['Mocha'],
    sizes: ["39", "40", "41", "42", "43", "44", "45", "46"],
    categoryName: 'Sandals',
    material: 'Birkibuc/Synthetic upper, Cork-latex Soft Footbed',
    style: 'Casual, Summer, Comfort',
    price: 950,
  },
  {
    identifier: 'shoe102.jpg',
    name: 'Birkenstock Arizona Camouflage',
    brand: 'Birkenstock',
    description: 'Add a rugged edge to your casual footwear rotation. This version of the classic two-strap Birkenstock Arizona features a woodland camouflage pattern across its durable upper. Finished with adjustable copper-tone buckles and the classic anatomically shaped cork footbed.',
    colors: ['Green Camo', 'Desert Camouflage'],
    sizes: ["40", "41", "42", "43", "44", "45"],
    categoryName: 'Sandals',
    material: 'Synthetic upper, Cork-latex footbed',
    style: 'Casual, Outdoor Lifestyle',
    price: 980,
  },
  {
    identifier: 'shoe101.webp',
    name: 'adidas Originals Superstar',
    brand: 'adidas',
    description: 'The undisputed iconic streetwear classic. This edition of the adidas Superstar features a sleek black leather upper paired with the signature rubber shell toe in matching black. Contrasting white serrated 3-Stripes and a white heel tab complete this timeless, versatile look.',
    colors: ['Core Black', 'Cloud White'],
    sizes: ["7", "8", "8.5", "9", "9.5", "10", "10.5", "11", "12"],
    categoryName: 'Sneakers',
    material: 'Leather upper, Rubber outsole',
    style: 'Classic, Streetwear, Everyday Casual',
    price: 1050,
  },
  {
    identifier: 'shoe12.jpg',
    name: 'PUMA Metallic Elastic Strap Ballet Sneaker',
    brand: 'PUMA',
    description: 'A sporty yet feminine slip-on flat perfect for casual wear. This shoe features a striking metallic silver upper with stylish criss-cross elastic straps across the instep for a secure, comfortable fit. Equipped with an Ortholite insole for plush, all-day cushioning.',
    colors: ['Metallic Silver', 'White', 'Grey'],
    sizes: ["6", "6.5", "7", "7.5", "8", "8.5", "9", "10"],
    categoryName: 'Slip-Ons & Flats',
    material: 'Synthetic leather upper, Elastic straps, Rubber outsole',
    style: 'Sporty Casual, Ballet Flat',
    price: 850,
  },
  {
    identifier: 'shoe11.jpg',
    name: 'adidas Originals Mesh Mary Jane Sneaker',
    brand: 'adidas',
    description: "A unique blend of sporty heritage and breathable, lightweight design. This Mary Jane-inspired silhouette features a rich brown, open-mesh upper framed by soft suede overlays. It's finished with classic white 3-Stripes and an adjustable hook-and-loop strap accented with a gold-tone Trefoil logo.",
    colors: ['Dark Brown', 'White', 'Gum'],
    sizes: ["5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "10"],
    categoryName: 'Sneakers',
    material: 'Mesh and Suede upper, Rubber sole',
    style: 'Casual, Breathable, Mary Jane',
    price: 1150,
  },
];

async function seed() {
  console.log('🌱 Starting GoMode database seeding...');

  try {
    // 1. Categories
    const categoryNames = ['Sneakers', 'Boots', 'Essentials', 'Collabs', 'Clogs & Slip-Ons', 'Sandals', 'Slip-Ons & Flats'];
    const categoryMap = {};

    for (const name of categoryNames) {
      let cat = await prisma.category.findUnique({ where: { name } });
      if (!cat) {
        cat = await prisma.category.create({
          data: {
            name,
            description: `Curated ${name} collection by GoMode`,
            status: 'ACTIVE',
          },
        });
        console.log(`✅ Created Category: ${name}`);
      }
      categoryMap[name] = cat.id;
    }

    // 2. Products
    for (const item of PRODUCTS_DATA) {
      const filePath = path.join(ITEMS_DIR, item.identifier);
      let imageUrl = `/items/${item.identifier}`;
      let publicId = `gomode_${item.identifier.replace(/\.[^.]+$/, '')}`;

      // Upload to Cloudinary if credentials are provided
      if (process.env.CLOUDINARY_CLOUD_NAME && fs.existsSync(filePath)) {
        try {
          console.log(`⬆️ Uploading ${item.identifier} to Cloudinary...`);
          const uploadRes = await cloudinary.uploader.upload(filePath, {
            folder: 'sneaker_garden_products',
            public_id: publicId,
            overwrite: true,
          });
          imageUrl = uploadRes.secure_url;
          publicId = uploadRes.public_id;
          console.log(`✅ Cloudinary URL: ${imageUrl}`);
        } catch (uploadErr) {
          console.warn(`⚠️ Cloudinary upload skipped for ${item.identifier}, using local URL: ${imageUrl}`);
        }
      }

      // Upsert Image in Image model
      let imageRecord = await prisma.image.findUnique({
        where: { public_id: publicId },
      });

      if (!imageRecord) {
        imageRecord = await prisma.image.create({
          data: {
            url: imageUrl,
            public_id: publicId,
            filename: item.identifier,
            format: path.extname(item.identifier).replace('.', ''),
            tags: item.brand,
          },
        });
      }

      // Check if product exists
      const categoryId = categoryMap[item.categoryName] || categoryMap['Sneakers'];
      let product = await prisma.product.findFirst({
        where: { name: item.name },
      });

      const tags = [
        item.brand,
        item.categoryName,
        ...item.colors,
        ...item.style.split(',').map((s) => s.trim()),
        ...item.sizes.map((s) => `Size ${s}`),
      ];

      const fullDescription = `${item.description}\n\nBrand: ${item.brand}\nColors: ${item.colors.join(' / ')}\nAvailable Sizes: ${item.sizes.join(', ')}\nMaterial: ${item.material}\nStyle: ${item.style}`;

      if (!product) {
        product = await prisma.product.create({
          data: {
            name: item.name,
            description: fullDescription,
            price: item.price,
            stock: 35,
            categoryId,
            tags,
            colors: item.colors,
            isActive: true,
            images: {
              create: [
                {
                  imageId: imageRecord.id,
                  isPrimary: true,
                },
              ],
            },
          },
        });
        console.log(`🎉 Created Product: ${item.name} (${item.identifier})`);
      } else {
        await prisma.product.update({
          where: { id: product.id },
          data: {
            description: fullDescription,
            price: item.price,
            tags,
            colors: item.colors,
            categoryId,
            isActive: true,
          },
        });
        console.log(`🔄 Updated Product: ${item.name}`);
      }
    }

    // 3. Create Default Admin User
    const adminEmail = 'admin@gomode.com';
    let adminUser = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          email: adminEmail,
          name: 'GoMode Admin',
          role: 'ADMIN',
          emailVerified: true,
        },
      });
      console.log(`👑 Created Admin User: ${adminEmail}`);
    }

    // 4. Default Delivery Fees for Ghana
    const deliveryRegions = [
      { region: 'Greater Accra', city: 'Accra', fee: 35 },
      { region: 'Greater Accra', city: 'Tema', fee: 40 },
      { region: 'Ashanti', city: 'Kumasi', fee: 55 },
      { region: 'Central', city: 'Cape Coast', fee: 50 },
      { region: 'Western', city: 'Takoradi', fee: 60 },
      { region: 'Eastern', city: 'Koforidua', fee: 45 },
      { region: 'Northern', city: 'Tamale', fee: 75 },
    ];

    for (const del of deliveryRegions) {
      await prisma.deliveryFee.upsert({
        where: {
          region_city: {
            region: del.region,
            city: del.city,
          },
        },
        update: { fee: del.fee, isActive: true },
        create: { region: del.region, city: del.city, fee: del.fee, isActive: true },
      });
    }
    console.log('🚚 Standard delivery fees for Ghana regions seeded.');

    console.log('🏁 Seeding finished successfully!');
  } catch (err) {
    console.error('❌ Seeding error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
