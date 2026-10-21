const express = require('express');
const router = express.Router();

const { isAdmin } = require('../middleware/auth');
const { cacheResponse, clearCache } = require('../middleware/cache');

const prisma = require('../lib/prisma');

// --- 1. GET ALL PRODUCTS (Public) ---
// Cache for 5 minutes (300 seconds)
router.get('/', cacheResponse(300), async (req, res) => {
  try {
    const includeInactive = req.query.includeInactive === 'true';
    const products = await prisma.product.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: { 
        category: true, 
        images: {       
          include: { image: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
});

// --- 1.2 GET TRENDING PRODUCTS (Public) ---
// Cache for 10 minutes
router.get('/trending', cacheResponse(600), async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      take: 8,
      orderBy: { views: 'desc' },
      include: { 
        category: true, 
        images: { include: { image: true } }
      }
    });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch trending products' });
  }
});

// --- 1.5. GET A SINGLE PRODUCT BY ID (Public) ---
// Cache for 15 minutes (900 seconds)
router.get('/:id', cacheResponse(900), async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await prisma.product.findUnique({
      where: { id },
      include: { 
        category: true, 
        images: {       
          include: { image: true }
        }
      } 
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('Fetch Product Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch product' });
  }
});

// --- 1.8. RECORD PRODUCT VIEW (Public) ---
router.post('/:id/view', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.update({
      where: { id },
      data: { views: { increment: 1 } }
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to record view' });
  }
});


// --- 2. CREATE A PRODUCT (Admin Only) ---
// Clear all products cache when a new one is created
router.post('/', isAdmin, clearCache(['/api/products*']), async (req, res) => {
  try {
    const { name, description, price, stock, categoryId, imageUrl, imagePublicId, tags, colors, images } = req.body;

    if (!name || !price || !categoryId) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    let imageConnections = [];
    if (images && images.length > 0) {
      imageConnections = images.map((img, index) => ({
        isPrimary: index === 0, // Force first image to be primary if not specified
        image: { connect: { public_id: img.public_id || img } } // Accept object or just string ID
      }));
    } else if (imagePublicId) {
      imageConnections = [{
        isPrimary: true,
        image: { connect: { public_id: imagePublicId } }
      }];
    } else {
      return res.status(400).json({ success: false, message: 'A primary image is required' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        categoryId,
        tags: tags || [],
        colors: colors || [],
        images: {
          create: imageConnections
        }
      },
      include: {
        images: {
          include: { image: true }
        }
      }
    });

    res.status(201).json({ success: true, message: 'Product created!', data: product });
  } catch (error) {
    console.error('Prisma Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create product' });
  }
});


// --- 3. UPDATE A PRODUCT (Admin Only) ---
// Clear cache on update
router.put('/:id', isAdmin, clearCache(['/api/products*']), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, categoryId, isActive, imageUrl, imagePublicId, tags, colors, images } = req.body;

    let updateData = {
      name,
      description,
      price: price ? parseFloat(price) : undefined,
      stock: stock !== undefined ? parseInt(stock) : undefined,
      categoryId,
      tags: tags !== undefined ? tags : undefined,
      colors: colors !== undefined ? colors : undefined,
      isActive
    };

    if (images && images.length > 0) {
      updateData.images = {
        deleteMany: {}, 
        create: images.map((img, index) => ({
          isPrimary: index === 0,
          image: { connect: { public_id: img.public_id || img } }
        }))
      };
    } else if (imageUrl && imagePublicId) {
      updateData.images = {
        deleteMany: {}, 
        create: {
          isPrimary: true,
          image: {
            connect: { public_id: imagePublicId }
          }
        }
      };
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        images: { include: { image: true } }
      }
    });

    res.status(200).json({ success: true, message: 'Product updated!', data: updatedProduct });
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
});


// --- 4. DELETE A PRODUCT (Admin Only) ---
// Clear cache on delete
router.delete('/:id', isAdmin, clearCache(['/api/products*']), async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id }
    });

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
});

// --- 5. BULK DELETE PRODUCTS (Admin Only) ---
router.post('/bulk-delete', isAdmin, clearCache(['/api/products*']), async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'No product IDs provided' });
    }

    await prisma.product.deleteMany({
      where: { id: { in: ids } }
    });

    res.status(200).json({ success: true, message: `${ids.length} product(s) deleted successfully` });
  } catch (error) {
    console.error('Bulk Delete Error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete products' });
  }
});

module.exports = router;