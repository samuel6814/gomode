const prisma = require('./prisma');

const SALE_KEY = 'SALES_SECTION';

async function readSale() {
  const row = await prisma.storeConfig.findUnique({ where: { key: SALE_KEY } });
  if (!row) return null;
  try {
    return JSON.parse(row.value);
  } catch {
    return null;
  }
}

function saleIsActive(sale) {
  if (!sale || !sale.endsAt || !Array.isArray(sale.productIds) || !sale.productIds.length) return false;
  const percent = Number(sale.discountPercent);
  if (!percent || percent <= 0 || percent >= 100) return false;
  return new Date(sale.endsAt).getTime() > Date.now();
}

function salePriceFor(product, sale) {
  if (!saleIsActive(sale) || !sale.productIds.includes(product.id)) return product.price;
  return Math.round(product.price * (1 - Number(sale.discountPercent) / 100) * 100) / 100;
}

module.exports = { SALE_KEY, readSale, saleIsActive, salePriceFor };
