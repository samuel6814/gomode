require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { PrismaClient } = require('@prisma/client');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const ITEMS_DIR = path.join(__dirname, '../../client/public/new-items');

const PRODUCTS_DATA = [
  {
    identifier: 'regular fit shirt.avif',
    name: 'Regular Fit Corduroy Long-Sleeve Shirt',
    brand: 'GoMode',
    description: 'A versatile, classic regular fit shirt crafted from soft, durable corduroy. Perfect for layering over a tee or wearing buttoned up during cooler months. Features a standard collar, button-up front, and a single chest patch pocket.',
    colors: ['Olive Green', 'Navy Blue', 'Camel', 'Burgundy'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    categoryName: 'Shirts',
    material: 'Premium Soft-Woven Corduroy',
    style: 'Casual Layering, Smart Streetwear',
    price: 45.00,
  },
  {
    identifier: 'Plain Knitted poloPlain Knitted polo.avif',
    name: 'Textured Wool-Blend Knitted Polo Sweater',
    brand: 'GoMode',
    description: 'Elevate your smart-casual wardrobe with this long-sleeve knitted polo. Made from a cozy, textured wool-blend, it features a classic spread collar with a neat 3-button placket and ribbed cuffs and hem for a perfect fit.',
    colors: ['Heather Brown', 'Charcoal Grey', 'Navy', 'Oatmeal'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    categoryName: 'Sweaters & Knits',
    material: 'Textured Wool-Blend Knit',
    style: 'Smart-Casual, Elevated Knitwear',
    price: 60.00,
  },
  {
    identifier: 'Plain Knitted polo.avif',
    name: 'Argyle Pattern Knit Cardigan Polo',
    brand: 'GoMode',
    description: 'Make a bold statement with this striking argyle pattern knit cardigan. Featuring a full button-down front, polo-style collar, and a comfortable relaxed fit. Ideal for adding a touch of retro sophistication to any outfit.',
    colors: ['Camel/Black Argyle', 'Grey/Navy Argyle'],
    sizes: ['S', 'M', 'L', 'XL'],
    categoryName: 'Cardigans',
    material: 'Jacquard Knit Blend',
    style: 'Retro Statement, Relaxed Tailoring',
    price: 65.00,
  },
  {
    identifier: 'Perry-Ellis-mens-Textured-Polo-Sweater-Cabernet.webp',
    name: "Perry Ellis Men's Textured Short-Sleeve Polo Sweater",
    brand: 'Perry Ellis',
    description: 'A sophisticated short-sleeve polo sweater featuring a subtle geometric textured knit pattern. The rich coloring and premium stretch fabric make it ideal for transitioning seamlessly from the office to the weekend.',
    colors: ['Cabernet', 'Midnight Blue', 'Forest Green', 'Slate Grey'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    categoryName: 'Polos',
    material: 'Geometric Textured Stretch Knit',
    style: 'Modern Executive, Smart Casual',
    price: 55.00,
  },
  {
    identifier: 'Perry-Ellis-mens-Slim-Fit-TENCEL-5-Pocket-Pant-Dark-Sapphire_7153fd2f.webp',
    name: "Perry Ellis Men's Slim Fit TENCEL™ 5-Pocket Pant",
    brand: 'Perry Ellis',
    description: 'Sleek, lightweight, and exceptionally comfortable, these slim-fit 5-pocket pants are crafted with an eco-friendly TENCEL™ blend fabric. They offer ultimate softness and slight stretch, serving as a modern, refined alternative to classic denim.',
    colors: ['Dark Sapphire', 'True Black', 'Khaki', 'Stone'],
    sizes: ['30x30', '32x30', '32x32', '34x32', '36x32', '38x34'],
    categoryName: 'Pants & Bottoms',
    material: 'Eco-friendly TENCEL™ Stretch Twill',
    style: 'Slim Fit Contemporary, Versatile Daywear',
    price: 75.00,
  },
  {
    identifier: 'Perry-Ellis-mens-Gatsby-Dress-Shoe-Black_6ef83567.webp',
    name: "Perry Ellis Men's Gatsby Patent Dress Shoe",
    brand: 'Perry Ellis',
    description: 'Step into elegance with the Gatsby Dress Shoe. Featuring a high-shine patent leather finish, classic lace-up closure, and a sleek oxford silhouette. The perfect finishing touch for formal events, galas, and weddings.',
    colors: ['Black Patent', 'Matte Black Leather'],
    sizes: ['7', '8', '9', '9.5', '10', '10.5', '11', '12', '13'],
    categoryName: 'Formal Footwear',
    material: 'High-Shine Patent Leather, Cushioned Insole',
    style: 'Formal Black-Tie, Sartorial Oxford',
    price: 95.00,
  },
  {
    identifier: 'Perry-Ellis-mens-Cool-Interlock-Tee-Reef-Waters-PS.webp',
    name: "Perry Ellis Men's Cool Interlock Performance Tee",
    brand: 'Perry Ellis',
    description: 'Upgrade your basics with this everyday t-shirt. The Cool Interlock Tee offers moisture-wicking properties and a smooth, soft finish. Cut for a modern fit that drapes perfectly and retains its shape wash after wash.',
    colors: ['Reef Waters Blue', 'Optic White', 'True Black', 'Heather Grey'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    categoryName: 'T-Shirts & Basics',
    material: 'Moisture-Wicking Interlock Cotton Blend',
    style: 'Performance Essential, Elevated Basics',
    price: 30.00,
  },
  {
    identifier: 'JJIEDDIE JJBASIC SQ 738 NOOS Loose fit jeans.avif',
    name: 'JJIEDDIE JJBASIC Loose Fit Light Wash Jeans',
    brand: 'Jack & Jones',
    description: 'Channel a relaxed, 90s-inspired retro vibe with the JJIEDDIE loose fit jeans. Crafted from sturdy, non-stretch light-wash denim, featuring a classic 5-pocket design, standard rise, and a spacious, relaxed fit all the way through the leg.',
    colors: ['Light Blue Wash', 'Vintage Indigo', 'Bleached White'],
    sizes: ['28x30', '30x32', '32x32', '34x32', '36x34'],
    categoryName: 'Denim & Jeans',
    material: '100% Rigid Heavyweight Cotton Denim',
    style: '90s Retro Loose Fit, Streetwear Denim',
    price: 50.00,
  },
  {
    identifier: 'JJICHRIS JJORIGINAL SQ 071 Relaxed Fit Jeans.avif',
    name: 'JJICHRIS JJORIGINAL Relaxed Fit Everyday Jeans',
    brand: 'Jack & Jones',
    description: 'The ultimate everyday denim. These relaxed fit jeans offer a comfortable mid-rise waist and a straight leg. Washed down to a versatile medium blue with subtle fading, providing a naturally lived-in look right out of the box.',
    colors: ['Medium Blue Wash', 'Dark Wash', 'Stone Wash'],
    sizes: ['30x30', '32x30', '32x32', '34x32', '36x32', '38x32'],
    categoryName: 'Denim & Jeans',
    material: 'Medium-Wash Durable Twill Denim',
    style: 'Everyday Relaxed Straight, Wardrobe Anchor',
    price: 55.00,
  },
  {
    identifier: 'JJIALEX JJORIGINAL SBD 306 NOOS Baggy fit jeans.avif',
    name: 'JJIALEX JJORIGINAL Baggy Fit Black Jeans',
    brand: 'Jack & Jones',
    description: 'Embrace maximum comfort and contemporary street style with the JJIALEX baggy fit jeans. Featuring a slightly dropped crotch, a wide leg profile, and classic black denim construction that pairs effortlessly with chunky sneakers and knitwear.',
    colors: ['Black', 'Faded Black', 'Raw Indigo'],
    sizes: ['28x30', '30x30', '32x32', '34x32', '36x32'],
    categoryName: 'Denim & Jeans',
    material: 'Overdyed Jet Black Denim',
    style: 'Contemporary Baggy, Wide Silhouette',
    price: 60.00,
  },
  {
    identifier: 'jackjones-jacpascalbackpackln-black.avif',
    name: 'Jack & Jones Pascal Canvas Commuter Backpack',
    brand: 'Jack & Jones',
    description: 'A durable, utilitarian-inspired black canvas backpack featuring contrasting faux-leather carrying handles and base trim. Designed with a roomy main compartment, a secure front zippered pouch, and adjustable straps for daily commuting or weekend getaways.',
    colors: ['Black', 'Olive Green', 'Navy Blue'],
    sizes: ['One Size'],
    categoryName: 'Bags & Accessories',
    material: 'Reinforced Heavy Canvas with Faux-Leather Accents',
    style: 'Urban Commuter, Minimalist Utility',
    price: 45.00,
  },
  {
    identifier: 'Bomber jacket.avif',
    name: 'Classic Leather Aviator Bomber Jacket',
    brand: 'GoMode',
    description: 'Infuse your wardrobe with rugged edge. This premium faux-leather bomber jacket features a striking contrast faux-shearling collar, a smooth zip-up front, and ribbed hem and cuffs to keep the cold out and the style locked in.',
    colors: ['Black w/ Cream Collar', 'Brown w/ Cream Collar'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    categoryName: 'Outerwear & Jackets',
    material: 'Textured Faux Leather with Contrast Faux-Shearling',
    style: 'Heritage Aviator, Outerwear Statement',
    price: 110.00,
  },
  {
    identifier: 'belt.jpg',
    name: 'Jack & Jones Embossed Leather Belt',
    brand: 'Jack & Jones',
    description: 'A reliable, sturdy everyday belt crafted from textured faux-leather. It boasts an antique-finish silver-tone buckle and features a bold, debossed Jack & Jones logo text along the strap. Perfect for holding up your favorite relaxed or baggy denim.',
    colors: ['Black', 'Cognac Brown'],
    sizes: ['30', '32', '34', '36', '38', '40', '42'],
    categoryName: 'Bags & Accessories',
    material: 'Embossed Textured Faux Leather, Silver Hardware',
    style: 'Essential Hardware, Street Utility',
    price: 25.00,
  },
  {
    identifier: 'Beanie.avif',
    name: 'Classic Ribbed Knit Beanie',
    brand: 'GoMode',
    description: 'An essential cold-weather staple. This beanie is knit from a soft, warm acrylic blend with a classic ribbed texture and a versatile fold-over cuff. It pairs perfectly with heavy outerwear like sherpa fleeces and oversized coats.',
    colors: ['Forest Green', 'Black', 'Charcoal Grey', 'Mustard Yellow'],
    sizes: ['One Size'],
    categoryName: 'Bags & Accessories',
    material: 'Thermal Ribbed Acrylic Blend Knit',
    style: 'Headwear Essential, Streetwear Staple',
    price: 18.00,
  },
  {
    identifier: 'backpack.avif',
    name: 'Minimalist Faux-Leather City Backpack',
    brand: 'GoMode',
    description: 'Sleek and sophisticated, this minimalist backpack is constructed from smooth, rich brown faux-leather. It features clean lines, a discreet front slip pocket, a secure dual-zip main compartment, and lightly padded straps, making it an excellent choice for a modern smart-casual look.',
    colors: ['Brown', 'Black'],
    sizes: ['One Size'],
    categoryName: 'Bags & Accessories',
    material: 'Supple Smooth Vegan Leather, Satin Lining',
    style: 'Modern Minimalist, Executive Travel',
    price: 65.00,
  },
];

async function seed() {
  console.log('🚀 Starting GoMode Catalog Seed...');

  try {
    // 1. Deactivate old products so only the 15 items are active
    const deactRes = await prisma.product.updateMany({
      data: { isActive: false },
    });
    console.log(`🔒 Deactivated ${deactRes.count} older catalog products.`);

    // 2. Ensure Categories Exist
    const categoryNames = [
      'Outerwear & Jackets',
      'Sweaters & Knits',
      'Cardigans',
      'Polos',
      'Shirts',
      'Denim & Jeans',
      'Pants & Bottoms',
      'Formal Footwear',
      'T-Shirts & Basics',
      'Bags & Accessories',
    ];

    const categoryMap = {};
    for (const name of categoryNames) {
      let cat = await prisma.category.findUnique({ where: { name } });
      if (!cat) {
        cat = await prisma.category.create({
          data: {
            name,
            description: `Curated ${name} by GoMode`,
            status: 'ACTIVE',
          },
        });
        console.log(`✅ Created Category: ${name}`);
      }
      categoryMap[name] = cat.id;
    }

    // 3. Process the 15 Products
    for (const item of PRODUCTS_DATA) {
      let filePath = path.join(ITEMS_DIR, item.identifier);
      if (!fs.existsSync(filePath) && item.identifier === 'belt.jpg') {
        const altPath = path.join(ITEMS_DIR, 'belt.avif');
        if (fs.existsSync(altPath)) filePath = altPath;
      }

      let imageUrl = `/new-items/${item.identifier}`;
      let publicId = `gomode_${item.identifier.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')}`;

      // Upload to Cloudinary if credentials configured
      if (process.env.CLOUDINARY_CLOUD_NAME && fs.existsSync(filePath)) {
        try {
          console.log(`⬆️ Uploading ${item.identifier} to Cloudinary...`);
          const uploadRes = await cloudinary.uploader.upload(filePath, {
            folder: 'gomode_products',
            public_id: publicId,
            overwrite: true,
          });
          imageUrl = uploadRes.secure_url;
          publicId = uploadRes.public_id;
          console.log(`✅ Cloudinary URL: ${imageUrl}`);
        } catch (uploadErr) {
          console.warn(`⚠️ Cloudinary upload skipped for ${item.identifier}: ${uploadErr.message}. Using local URL: ${imageUrl}`);
        }
      }

      // Upsert Image record
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
      } else {
        imageRecord = await prisma.image.update({
          where: { id: imageRecord.id },
          data: { url: imageUrl },
        });
      }

      const categoryId = categoryMap[item.categoryName] || categoryMap['Outerwear & Jackets'];

      const tags = [
        'gomode',
        item.brand,
        item.categoryName,
        ...item.colors,
        ...item.sizes.map((s) => `Size ${s}`),
      ];

      const fullDescription = `${item.description}\n\nBrand: ${item.brand}\nColors: ${item.colors.join(', ')}\nAvailable Sizes: ${item.sizes.join(', ')}\nMaterial: ${item.material}\nStyle: ${item.style}`;

      let product = await prisma.product.findFirst({
        where: { name: item.name },
      });

      if (!product) {
        product = await prisma.product.create({
          data: {
            name: item.name,
            description: fullDescription,
            price: item.price,
            stock: 40,
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
        console.log(`🎉 Created Product: ${item.name} ($${item.price})`);
      } else {
        product = await prisma.product.update({
          where: { id: product.id },
          data: {
            description: fullDescription,
            price: item.price,
            stock: 40,
            categoryId,
            tags,
            colors: item.colors,
            isActive: true,
          },
        });

        // Ensure image relation
        const existingRel = await prisma.productImage.findFirst({
          where: { productId: product.id, imageId: imageRecord.id },
        });
        if (!existingRel) {
          await prisma.productImage.create({
            data: {
              productId: product.id,
              imageId: imageRecord.id,
              isPrimary: true,
            },
          });
        }

        console.log(`🔄 Updated Product: ${item.name} ($${item.price})`);
      }
    }

    // 4. Default Admin User for GoMode
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

    // 5. Verification: Count active products
    const activeCount = await prisma.product.count({ where: { isActive: true } });
    console.log(`✨ Total Active GoMode Products: ${activeCount}`);
    console.log('🏁 GoMode Seeding completed successfully!');
  } catch (err) {
    console.error('❌ Seeding error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
