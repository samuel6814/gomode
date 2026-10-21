const express = require('express');
const router = express.Router();

const { isAdmin } = require('../middleware/auth');

const prisma = require('../lib/prisma');

const DEFAULT_HERO = {
  eyebrow: 'The Masterpiece Experience',
  headline: 'Fine Art',
  headlineItalic: 'drawn in',
  headlineEnd: 'Graphite',
  description:
    'Nortey George Okwei is a classically trained pencil artist. Every portrait begins as graphite on paper, with layered strokes, cross-hatching, and patience until the subject breathes on the page.',
  ctaPrimary: { text: 'Commission Yours', href: '/commissions' },
  ctaSecondary: { text: 'View Gallery', href: '/gallery' },
};

router.get('/hero', async (req, res) => {
  try {
    const config = await prisma.storeConfig.findUnique({
      where: { key: 'HERO_SECTION' },
    });

    if (!config) {
      return res.status(200).json({
        success: true,
        data: DEFAULT_HERO,
      });
    }

    res.status(200).json({ success: true, data: JSON.parse(config.value) });
  } catch (error) {
    console.error('Fetch Hero Config Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch hero configuration' });
  }
});

router.put('/hero', isAdmin, async (req, res) => {
  try {
    const heroData = req.body;

    const updatedConfig = await prisma.storeConfig.upsert({
      where: { key: 'HERO_SECTION' },
      update: { value: JSON.stringify(heroData) },
      create: { key: 'HERO_SECTION', value: JSON.stringify(heroData) },
    });

    res.status(200).json({
      success: true,
      message: 'Hero Section updated successfully!',
      data: JSON.parse(updatedConfig.value),
    });
  } catch (error) {
    console.error('Update Hero Config Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update hero configuration' });
  }
});

module.exports = router;
