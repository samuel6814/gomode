const express = require('express');
const router = express.Router();

// Assuming you have a general auth middleware for logged-in users. 
// If it's named differently in your auth.js file, just update the import!
const { isAuthenticated } = require('../middleware/auth'); 

const prisma = require('../lib/prisma');
const { getPrismaWithUser } = require('../lib/prisma');
const { readPricing, cediPriceFor } = require('../lib/cjPricing');

function presentItem(item, pricing) {
  if (item.source === 'cj' && item.cjVariant?.product) {
    const variant = item.cjVariant;
    const product = variant.product;
    const label = variant.optionLabel ? `${product.name} (${variant.optionLabel})` : product.name;
    return {
      id: item.id,
      quantity: item.quantity,
      source: 'cj',
      cjVariantId: variant.id,
      productId: null,
      product: {
        id: product.id,
        source: 'cj',
        name: label,
        price: cediPriceFor(variant.price || product.price, pricing),
        stock: Math.max(product.stock || 0, 99),
        images: product.imageUrl ? [{ image: { url: product.imageUrl } }] : [],
      },
    };
  }
  return { ...item, source: item.source || 'buyy' };
}

const getDb = (req) => req.user ? getPrismaWithUser(req.user.id, req.user.role) : prisma;

// --- 1. GET USER'S CART ---
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id; // From your auth middleware
    const db = getDb(req);

    let cart = await db.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { include: { image: true } },
              },
            },
            cjVariant: { include: { product: true } },
          },
        }
      }
    });

    // If they don't have a cart yet, create an empty one
    if (!cart) {
      cart = await db.cart.create({
        data: { userId },
        include: { items: true }
      });
    }

    const pricing = await readPricing();
    res.status(200).json({
      success: true,
      data: {
        ...cart,
        items: (cart.items || []).map((item) => presentItem(item, pricing)),
      },
    });
  } catch (error) {
    console.error('Cart Fetch Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch cart' });
  }
});

// --- 2. ADD ITEM TO CART ---
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, cjVariantId, quantity, source } = req.body;
    const isCj = source === 'cj' || Boolean(cjVariantId);
    if (!isCj && !productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }
    if (isCj && !cjVariantId) {
      return res.status(400).json({ success: false, message: 'Choose a CJ variant' });
    }

    const db = getDb(req);
    const cart = await db.cart.upsert({
      where: { userId },
      update: {},
      create: { userId }
    });

    const qty = quantity || 1;
    const lineKey = isCj ? `cj:${cjVariantId}` : `buyy:${productId}`;
    if (isCj) {
      const variant = await prisma.cjVariant.findUnique({ where: { id: cjVariantId } });
      if (!variant) return res.status(400).json({ success: false, message: 'That CJ variant is not available' });
    }
    const cartItem = await db.cartItem.upsert({
      where: { cartId_lineKey: { cartId: cart.id, lineKey } },
      update: { quantity: { increment: qty } },
      create: isCj
        ? { cartId: cart.id, lineKey, source: 'cj', cjVariantId, quantity: qty }
        : { cartId: cart.id, lineKey, source: 'buyy', productId, quantity: qty },
    });

    res.status(200).json({ success: true, message: 'Item added to cart!', data: cartItem });
  } catch (error) {
    console.error('Add to Cart Error:', error);
    res.status(500).json({ success: false, message: 'Failed to add item to cart' });
  }
});

module.exports = router;