const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { isAdmin } = require('../middleware/auth');
const { SALE_KEY, readSale, saleIsActive, salePriceFor } = require('../lib/sale');

router.get('/', async (req, res) => {
  try {
    const sale = await readSale();
    const active = saleIsActive(sale);
    if (!sale) {
      return res.status(200).json({ success: true, data: { active: false, discountPercent: 0, endsAt: null, productIds: [], products: [] } });
    }

    const products = sale.productIds?.length
      ? await prisma.product.findMany({
        where: { id: { in: sale.productIds }, isActive: true },
        include: { category: true, images: { include: { image: true } } },
      })
      : [];

    const ordered = (sale.productIds || [])
      .map((id) => products.find((product) => product.id === id))
      .filter(Boolean)
      .map((product) => ({ ...product, salePrice: salePriceFor(product, active ? sale : null) }));

    res.status(200).json({
      success: true,
      data: {
        active: active && ordered.length > 0,
        discountPercent: Number(sale.discountPercent) || 0,
        endsAt: sale.endsAt || null,
        productIds: sale.productIds || [],
        products: active ? ordered : [],
      },
    });
  } catch (error) {
    console.error('Fetch Sale Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch the sale' });
  }
});

router.put('/', isAdmin, async (req, res) => {
  try {
    const discountPercent = Number(req.body.discountPercent);
    const endsAt = req.body.endsAt;
    const productIds = Array.isArray(req.body.productIds) ? req.body.productIds : [];

    if (!discountPercent || discountPercent <= 0 || discountPercent >= 100) {
      return res.status(400).json({ success: false, message: 'Discount must be between 1 and 99' });
    }
    if (!endsAt || Number.isNaN(new Date(endsAt).getTime())) {
      return res.status(400).json({ success: false, message: 'A valid end time is required' });
    }

    const found = productIds.length
      ? await prisma.product.findMany({ where: { id: { in: productIds } }, select: { id: true } })
      : [];
    const validIds = productIds.filter((id) => found.some((product) => product.id === id));

    const value = JSON.stringify({ discountPercent, endsAt, productIds: validIds });
    await prisma.storeConfig.upsert({
      where: { key: SALE_KEY },
      update: { value },
      create: { key: SALE_KEY, value },
    });

    res.status(200).json({ success: true, data: { discountPercent, endsAt, productIds: validIds } });
  } catch (error) {
    console.error('Update Sale Error:', error);
    res.status(500).json({ success: false, message: 'Failed to save the sale' });
  }
});

module.exports = router;
