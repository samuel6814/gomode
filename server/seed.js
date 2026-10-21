// seed.js
require('dotenv').config(); // Load environment variables
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Point to your local folder of images
const IMAGES_DIR = path.join(__dirname, 'seed-images');

async function seedImages() {
  console.log('🌱 Starting image seed process...');

  try {
    // Read all files in the directory
    const files = fs.readdirSync(IMAGES_DIR);
    
    // Filter out hidden files like .DS_Store
    const imageFiles = files.filter(file => file.match(/\.(jpg|jpeg|png|webp|gif)$/i));

    if (imageFiles.length === 0) {
      console.log('⚠️ No images found in the seed-images folder.');
      return;
    }

    console.log(`Found ${imageFiles.length} images. Uploading to Cloudinary...`);

    // Loop through each image
    for (const fileName of imageFiles) {
      const filePath = path.join(IMAGES_DIR, fileName);
      
      console.log(`⬆️ Uploading ${fileName}...`);

      // 3. Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(filePath, {
        folder: 'store_template_seed', // Organizes them nicely in your Cloudinary dashboard
        use_filename: true,
        unique_filename: false,
      });

      console.log(`✅ Uploaded to Cloudinary: ${uploadResult.secure_url}`);

      // 4. Save to Prisma Database
      // Adjust this to match your exact Prisma Schema!
      const savedImage = await prisma.image.create({
        data: {
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
          // If you want to automatically link them to a specific product, 
          // you would include productId here.
        }
      });

      console.log(`💾 Saved to Database with ID: ${savedImage.id}`);
    }

    console.log('🎉 Seed complete! All images uploaded and saved.');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    // Disconnect Prisma when done
    await prisma.$disconnect();
  }
}

// Execute the function
seedImages();