const express = require('express');
const prisma = require('../lib/prisma');
const { isAdmin } = require('../middleware/auth');
const { syncCatalog, authStatus } = require('../lib/cj');
const { PRICING_KEY, readPricing, normalizePricing, withCediPrices } = require('../lib/cjPricing');

const include = { variants: true };
const publicRouter = express.Router();
const adminRouter = express.Router();

publicRouter.get('/pricing', async (req, res) => {
  try {
    const pricing = await readPricing();
    res.status(200).json({ success: true, data: pricing });
  } catch (error) {
    console.error('CJ pricing error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to load CJ pricing' });
  }
});

publicRouter.get('/products', async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 100));
    const [products, pricing] = await Promise.all([
      prisma.cjProduct.findMany({
        where: { isActive: true },
        include,
        orderBy: { updatedAt: 'desc' },
        take: limit,
      }),
      readPricing(),
    ]);
    res.status(200).json({ success: true, data: products.map((product) => withCediPrices(product, pricing)) });
  } catch (error) {
    console.error('CJ list error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to load CJ products' });
  }
});

publicRouter.get('/products/:id', async (req, res) => {
  try {
    const product = await prisma.cjProduct.findFirst({
      where: { id: req.params.id, isActive: true },
      include,
    });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    const pricing = await readPricing();
    res.status(200).json({ success: true, data: withCediPrices(product, pricing) });
  } catch (error) {
    console.error('CJ product error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to load the CJ product' });
  }
});

adminRouter.get('/status', isAdmin, async (req, res) => {
  try {
    const status = await authStatus();
    res.status(200).json({ success: true, data: status });
  } catch (error) {
    console.error('CJ status error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to read CJ status' });
  }
});

adminRouter.get('/products', isAdmin, async (req, res) => {
  try {
    const [products, pricing] = await Promise.all([
      prisma.cjProduct.findMany({
        include,
        orderBy: { updatedAt: 'desc' },
        take: 200,
      }),
      readPricing(),
    ]);
    res.status(200).json({ success: true, data: products.map((product) => withCediPrices(product, pricing)) });
  } catch (error) {
    console.error('CJ admin list error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to load CJ products' });
  }
});

adminRouter.put('/pricing', isAdmin, async (req, res) => {
  try {
    const pricing = normalizePricing(req.body);
    if (!(Number(req.body?.usdToGhs) > 0)) {
      return res.status(400).json({ success: false, message: 'Exchange rate must be greater than 0' });
    }
    const tax = Number(req.body?.taxPercent);
    if (!Number.isFinite(tax) || tax < 0 || tax > 100) {
      return res.status(400).json({ success: false, message: 'Tax must be between 0 and 100' });
    }
    const value = JSON.stringify(pricing);
    await prisma.storeConfig.upsert({
      where: { key: PRICING_KEY },
      update: { value },
      create: { key: PRICING_KEY, value },
    });
    res.status(200).json({ success: true, data: pricing });
  } catch (error) {
    console.error('CJ pricing save error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to save CJ pricing' });
  }
});

adminRouter.post('/sync', isAdmin, async (req, res) => {
  try {
    const result = await syncCatalog({
      keyword: req.body?.keyword,
      pages: req.body?.pages,
    });
    const status = await authStatus();
    res.status(200).json({ success: true, data: { ...result, ...status } });
  } catch (error) {
    console.error('CJ sync error:', error.code || '', error.requestId || '', error.message);
    res.status(500).json({ success: false, message: error.message || 'CJ sync failed' });
  }
});

module.exports = { publicRouter, adminRouter };
