const express = require('express');
const router = express.Router();

const { isAdmin } = require('../middleware/auth');
const { cacheResponse, clearCache } = require('../middleware/cache');

const prisma = require('../lib/prisma');

// --- 1. GET ALL CATEGORIES ---
// Used by CategoryPageAdmin.jsx to list them, and by AddProducts.jsx for the dropdown
// Cache for 10 minutes (600 seconds)
router.get('/', cacheResponse(600), async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { products: true } } // Shows the admin how many products are in each category
      },
      orderBy: { name: 'asc' }
    });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error('Fetch Categories Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
});

// --- 2. CREATE A CATEGORY ---
// Used by AddCategory.jsx
// Clear cache on create
router.post('/', isAdmin, clearCache(['/api/categories*']), async (req, res) => {
  try {
    // 🚨 UPDATED: Now extracts all the new fields from your frontend form!
    const { name, description, image, status } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const category = await prisma.category.create({
      data: { 
        name,
        description: description || null,
        image: image || null,
        status: status || 'ACTIVE'
      }
    });

    res.status(201).json({ success: true, message: 'Category created!', data: category });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'A category with this name already exists' });
    }
    console.error('Create Category Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create category' });
  }
});

// --- 3. UPDATE A CATEGORY ---
// Used by EditCategory.jsx
// Clear cache on update
router.put('/:id', isAdmin, clearCache(['/api/categories*']), async (req, res) => {
  try {
    const { id } = req.params;
    // 🚨 UPDATED: Accepts the new fields for edits too!
    const { name, description, image, status } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { 
        name,
        description: description !== undefined ? description : undefined,
        image: image !== undefined ? image : undefined,
        status: status !== undefined ? status : undefined
      }
    });

    res.status(200).json({ success: true, message: 'Category updated!', data: updatedCategory });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'A category with this name already exists' });
    }
    console.error('Update Category Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update category' });
  }
});

// --- 4. DELETE A CATEGORY ---
// Clear cache on delete
router.delete('/:id', isAdmin, clearCache(['/api/categories*']), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if products are currently using this category before deleting
    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot delete. There are ${productCount} products in this category.` 
      });
    }

    await prisma.category.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Category deleted!' });
  } catch (error) {
    console.error('Delete Category Error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete category' });
  }
});

// --- 5. BULK DELETE CATEGORIES ---
router.post('/bulk-delete', isAdmin, clearCache(['/api/categories*']), async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'No category IDs provided' });
    }

    // Check if any of the categories have products
    const catsWithProducts = await prisma.category.findMany({
      where: { id: { in: ids } },
      include: { _count: { select: { products: true } } }
    });

    const blocked = catsWithProducts.filter(c => c._count.products > 0);
    if (blocked.length > 0) {
      const names = blocked.map(c => `"${c.name}" (${c._count.products} products)`).join(', ');
      return res.status(400).json({
        success: false,
        message: `Cannot delete categories with products: ${names}. Remove the products first.`
      });
    }

    await prisma.category.deleteMany({
      where: { id: { in: ids } }
    });

    res.status(200).json({ success: true, message: `${ids.length} category(ies) deleted successfully` });
  } catch (error) {
    console.error('Bulk Delete Categories Error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete categories' });
  }
});

module.exports = router;