const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { isAdmin } = require('../middleware/auth');
const { cacheResponse, clearCache } = require('../middleware/cache');

// 1. Get all delivery fees (Public, cached for 1 hour)
router.get('/', cacheResponse(3600), async (req, res) => {
  try {
    const fees = await prisma.deliveryFee.findMany({
      where: { isActive: true },
      orderBy: [{ region: 'asc' }, { city: 'asc' }]
    });
    res.status(200).json({ success: true, data: fees });
  } catch (error) {
    console.error('Error fetching delivery fees:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch delivery fees' });
  }
});

// 2. Admin: Get all delivery fees (including inactive)
router.get('/admin', isAdmin, async (req, res) => {
  try {
    const fees = await prisma.deliveryFee.findMany({
      orderBy: [{ region: 'asc' }, { city: 'asc' }]
    });
    res.status(200).json({ success: true, data: fees });
  } catch (error) {
    console.error('Error fetching delivery fees (admin):', error);
    res.status(500).json({ success: false, message: 'Failed to fetch delivery fees' });
  }
});

// 3. Admin: Create a new delivery fee
router.post('/', isAdmin, async (req, res) => {
  try {
    const { region, city, fee, isActive } = req.body;
    
    // Ensure uniqueness
    const existing = await prisma.deliveryFee.findFirst({
      where: { region, city: city || null }
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'A fee for this region/city already exists.' });
    }

    const newFee = await prisma.deliveryFee.create({
      data: { region, city: city || null, fee: parseFloat(fee), isActive: isActive ?? true }
    });

    clearCache('/api/delivery');
    res.status(201).json({ success: true, data: newFee });
  } catch (error) {
    console.error('Error creating delivery fee:', error);
    res.status(500).json({ success: false, message: 'Failed to create delivery fee' });
  }
});

// 4. Admin: Update a delivery fee
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { region, city, fee, isActive } = req.body;

    const updatedFee = await prisma.deliveryFee.update({
      where: { id },
      data: { region, city: city || null, fee: parseFloat(fee), isActive }
    });

    clearCache('/api/delivery');
    res.status(200).json({ success: true, data: updatedFee });
  } catch (error) {
    console.error('Error updating delivery fee:', error);
    res.status(500).json({ success: false, message: 'Failed to update delivery fee' });
  }
});

// 5. Admin: Delete a delivery fee
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.deliveryFee.delete({ where: { id } });
    
    clearCache('/api/delivery');
    res.status(200).json({ success: true, message: 'Delivery fee deleted successfully' });
  } catch (error) {
    console.error('Error deleting delivery fee:', error);
    res.status(500).json({ success: false, message: 'Failed to delete delivery fee' });
  }
});

// 6. Calculate fee for a specific region and city (Public)
router.post('/calculate', async (req, res) => {
  try {
    const { region, city } = req.body;
    if (!region) return res.status(400).json({ success: false, message: 'Region is required' });

    // Try finding exact city match first
    let feeRecord = null;
    if (city) {
      feeRecord = await prisma.deliveryFee.findFirst({
        where: { region, city, isActive: true }
      });
    }

    // If no city match, fallback to region general fee
    if (!feeRecord) {
      feeRecord = await prisma.deliveryFee.findFirst({
        where: { region, city: null, isActive: true }
      });
    }

    // If no specific fee exists, fallback to a standard flat rate (e.g. 30 GHS)
    const finalFee = feeRecord ? feeRecord.fee : 30.00;

    res.status(200).json({ success: true, fee: finalFee, appliedRecord: feeRecord });
  } catch (error) {
    console.error('Error calculating delivery fee:', error);
    res.status(500).json({ success: false, message: 'Failed to calculate fee' });
  }
});

module.exports = router;
