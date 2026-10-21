const express = require('express');
const router = express.Router();

const { isAdmin } = require('../middleware/auth');
const { cacheResponse } = require('../middleware/cache');

const prisma = require('../lib/prisma');

// --- A. STOREFRONT SEARCH ---
// Cache storefront searches for 5 minutes (300 seconds)
router.get('/storefront', cacheResponse(300), async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(200).json({ success: true, data: [] });

    const products = await prisma.product.findMany({
      where: {
        AND: [
          { isActive: true }, 
          { stock: { gt: 0 } }, 
          {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
              { category: { name: { contains: q, mode: 'insensitive' } } }
            ]
          }
        ]
      },
      include: { category: true, images: { take: 1, include: { image: true } } },
      take: 10
    });

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error('Storefront Search Error:', error);
    res.status(500).json({ success: false, message: 'Search failed' });
  }
});

// --- B. ADMIN SEARCH (Deep Relational Command Palette) ---
// Cache admin searches for 1 minute (60 seconds)
router.get('/admin', isAdmin, cacheResponse(60), async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(200).json({ success: true, data: { products: [], users: [], orders: [], categories: [] } });
    }

    // Guard against Prisma crashing on invalid UUIDs
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(q);

    // Run 4 deep database queries simultaneously
    const [products, users, orders, categories] = await Promise.all([
      // 1. Products (Search name and description)
      prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } }
          ]
        },
        take: 5
      }),
      // 2. Users (Search name or email)
      prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } }
          ]
        },
        take: 5
      }),
      // 3. Orders (Search ID, Customer Email, Customer Name, OR Items ordered!)
      prisma.order.findMany({
        where: {
          OR: [
            ...(isUUID ? [{ id: { equals: q } }] : []), 
            { user: { email: { contains: q, mode: 'insensitive' } } },
            { user: { name: { contains: q, mode: 'insensitive' } } },
            // 🚨 THIS IS THE MAGIC: It searches the actual items inside the order
            { items: { some: { productName: { contains: q, mode: 'insensitive' } } } } 
          ]
        },
        include: { user: true, items: true }, // We include items to show them in the UI
        take: 5
      }),
      // 4. Categories
      prisma.category.findMany({
        where: { name: { contains: q, mode: 'insensitive' } },
        take: 5
      })
    ]);

    res.status(200).json({
      success: true,
      data: { products, users, orders, categories }
    });

  } catch (error) {
    console.error('Admin Search Error:', error);
    res.status(500).json({ success: false, message: 'Admin search failed' });
  }
});

module.exports = router;