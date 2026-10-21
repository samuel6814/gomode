const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DOMAIN = 'https://example.com'; // Change this to your actual production domain

const staticRoutes = [
  '/',
  '/shop',
  '/shop/categories',
  '/about',
  '/commissions',
  '/contact',
  '/policies',
  '/shipping',
  '/refunds',
  '/privacy',
  '/terms'
];

async function generateSitemap() {
  console.log('Generating sitemap.xml...');
  
  try {
    // 1. Fetch dynamic data from the database
    const products = await prisma.product.findMany({
      where: { stock: { gt: 0 } }, // Only index products that are in stock (optional)
      select: { id: true, updatedAt: true }
    });

    const categories = await prisma.category.findMany({
      select: { name: true }
    });

    // 2. Build the XML structure
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // 3. Add Static Routes
    const today = new Date().toISOString().split('T')[0];
    
    for (const route of staticRoutes) {
      xml += `  <url>\n`;
      xml += `    <loc>${DOMAIN}${route}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>${route === '/' ? 'daily' : 'weekly'}</changefreq>\n`;
      xml += `    <priority>${route === '/' ? '1.0' : '0.8'}</priority>\n`;
      xml += `  </url>\n`;
    }

    // 4. Add Dynamic Category Routes
    for (const category of categories) {
      // Assuming Category filter uses query params like /shop?category=CategoryName
      // But we will just index the main /shop/categories page which has them all.
      // If we had /category/:id routes, we would add them here.
    }

    // 5. Add Dynamic Product Routes
    for (const product of products) {
      const productDate = product.updatedAt ? product.updatedAt.toISOString().split('T')[0] : today;
      xml += `  <url>\n`;
      xml += `    <loc>${DOMAIN}/product/${product.id}</loc>\n`;
      xml += `    <lastmod>${productDate}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.9</priority>\n`;
      xml += `  </url>\n`;
    }

    xml += `</urlset>\n`;

    // 6. Write to client/public/sitemap.xml
    const sitemapPath = path.join(__dirname, '../../client/public/sitemap.xml');
    fs.writeFileSync(sitemapPath, xml, 'utf8');

    console.log(`✅ Successfully generated sitemap.xml at ${sitemapPath}`);
    console.log(`Total indexed pages: ${staticRoutes.length + products.length}`);

  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
  } finally {
    await prisma.$disconnect();
  }
}

generateSitemap();
