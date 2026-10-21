const prisma = require('./prisma');

const PRICING_KEY = 'CJ_PRICING';
const DEFAULT_PRICING = { usdToGhs: 11.75, taxPercent: 15 };

function normalizePricing(raw) {
  const usdToGhs = Number(raw?.usdToGhs);
  const taxPercent = Number(raw?.taxPercent);
  return {
    usdToGhs: usdToGhs > 0 ? usdToGhs : DEFAULT_PRICING.usdToGhs,
    taxPercent: Number.isFinite(taxPercent) && taxPercent >= 0 && taxPercent <= 100
      ? taxPercent
      : DEFAULT_PRICING.taxPercent,
  };
}

async function readPricing() {
  const row = await prisma.storeConfig.findUnique({ where: { key: PRICING_KEY } });
  if (!row) return { ...DEFAULT_PRICING };
  try {
    return normalizePricing(JSON.parse(row.value));
  } catch {
    return { ...DEFAULT_PRICING };
  }
}

function cediPriceFor(usd, pricing) {
  const amount = Number(usd) || 0;
  const rate = Number(pricing.usdToGhs);
  const tax = Number(pricing.taxPercent);
  return Math.round(amount * rate * (1 + tax / 100) * 100) / 100;
}

function withCediPrices(product, pricing) {
  return {
    ...product,
    cediPrice: cediPriceFor(product.price, pricing),
    variants: (product.variants || []).map((variant) => ({
      ...variant,
      cediPrice: cediPriceFor(variant.price, pricing),
    })),
  };
}

module.exports = {
  PRICING_KEY,
  DEFAULT_PRICING,
  readPricing,
  normalizePricing,
  cediPriceFor,
  withCediPrices,
};
