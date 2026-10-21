const prisma = require('./prisma');

const HOST = 'https://developers.cjdropshipping.com/api2.0/v1';
const AUTH_ID = 'default';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function parseDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function usdAmount(value) {
  const match = String(value ?? '').match(/[\d.]+/);
  return match ? Number(match[0]) : 0;
}

function plainText(value) {
  return String(value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 4000);
}

function productsFromList(data) {
  const content = data?.content || data?.list || [];
  if (content.some((item) => Array.isArray(item?.productList))) {
    return content.flatMap((item) => item.productList || []);
  }
  return Array.isArray(content) ? content : [];
}

function stockFromPayload(data) {
  const rows = data?.inventories || [];
  const fromAreas = rows.reduce((sum, row) => sum + Number(row.totalInventoryNum || row.totalInventory || 0), 0);
  if (fromAreas > 0) return fromAreas;
  const variants = data?.variantInventories || [];
  return variants.reduce((sum, variant) => {
    const inventories = variant.inventory || [];
    return sum + inventories.reduce((inner, row) => inner + Number(row.totalInventory || 0), 0);
  }, 0);
}

async function cjRequest(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['CJ-Access-Token'] = token;
  const response = await fetch(`${HOST}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await response.json().catch(() => ({}));
  const code = json.code;
  const ok = response.status === 200 && (code == null || Number(code) === 200);
  if (!ok) {
    const error = new Error(json.message || 'CJ request failed');
    error.code = code;
    error.requestId = json.requestId;
    throw error;
  }
  return json.data;
}

async function saveAuth(data) {
  const accessTokenExpiryDate = parseDate(data.accessTokenExpiryDate);
  const refreshTokenExpiryDate = parseDate(data.refreshTokenExpiryDate);
  if (!data.accessToken || !data.refreshToken || !accessTokenExpiryDate || !refreshTokenExpiryDate) {
    throw new Error('CJ did not return a usable token');
  }
  return prisma.cjAuth.upsert({
    where: { id: AUTH_ID },
    update: {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      accessTokenExpiryDate,
      refreshTokenExpiryDate,
      openId: String(data.openId || ''),
    },
    create: {
      id: AUTH_ID,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      accessTokenExpiryDate,
      refreshTokenExpiryDate,
      openId: String(data.openId || ''),
    },
  });
}

async function fetchTokenWithKey() {
  const apiKey = process.env.CJ_API_KEY;
  if (!apiKey) {
    const error = new Error('CJ_API_KEY is not set');
    error.status = 500;
    throw error;
  }
  const data = await cjRequest('/authentication/getAccessToken', {
    method: 'POST',
    body: { apiKey },
  });
  return saveAuth(data);
}

async function getAccessToken() {
  const row = await prisma.cjAuth.findUnique({ where: { id: AUTH_ID } });
  const now = Date.now();
  const skew = 5 * 60 * 1000;
  if (row && row.accessTokenExpiryDate.getTime() - skew > now) return row.accessToken;
  if (row && row.refreshTokenExpiryDate.getTime() > now) {
    try {
      const data = await cjRequest('/authentication/refreshAccessToken', {
        method: 'POST',
        body: { refreshToken: row.refreshToken },
      });
      const saved = await saveAuth(data);
      return saved.accessToken;
    } catch (error) {
      if (Number(error.code) !== 1600003) throw error;
    }
  }
  const saved = await fetchTokenWithKey();
  return saved.accessToken;
}

async function cjFetch(path) {
  let token = await getAccessToken();
  try {
    return await cjRequest(path, { token });
  } catch (error) {
    if (Number(error.code) !== 1600001) throw error;
    const saved = await fetchTokenWithKey();
    return cjRequest(path, { token: saved.accessToken });
  }
}

async function upsertProduct(item, detail, stock) {
  const pid = detail?.pid || item.id || item.pid;
  if (!pid) return null;
  const variants = Array.isArray(detail?.variants) ? detail.variants : [];
  const price = usdAmount(detail?.sellPrice ?? item.sellPrice ?? item.nowPrice);
  const imageUrl = detail?.bigImage || item.bigImage || detail?.productImageSet?.[0] || '';
  const name = detail?.productNameEn || item.nameEn || item.productNameEn || 'CJ product';
  const categoryName = detail?.categoryName || item.threeCategoryName || item.oneCategoryName || '';
  const inventory = stockFromPayload(stock);
  const listedStock = Number(item.warehouseInventoryNum || 0);
  const record = await prisma.cjProduct.upsert({
    where: { pid },
    update: {
      name,
      description: plainText(detail?.description || item.description),
      price,
      currency: 'USD',
      imageUrl,
      categoryName,
      stock: inventory || listedStock,
      tags: ['cj'],
      isActive: String(detail?.status || item.saleStatus || '3') !== '2',
    },
    create: {
      pid,
      name,
      description: plainText(detail?.description || item.description),
      price,
      currency: 'USD',
      imageUrl,
      categoryName,
      stock: inventory || listedStock,
      tags: ['cj'],
      isActive: String(detail?.status || item.saleStatus || '3') !== '2',
    },
  });

  await prisma.cjVariant.deleteMany({ where: { productId: record.id } });
  if (variants.length) {
    await prisma.cjVariant.createMany({
      data: variants.filter((variant) => variant.vid).map((variant) => ({
        productId: record.id,
        vid: String(variant.vid),
        sku: String(variant.variantSku || ''),
        price: usdAmount(variant.variantSellPrice ?? price),
        optionLabel: String(variant.variantKey || variant.variantNameEn || ''),
      })),
    });
  }
  return record;
}

async function syncCatalog({ keyword = '', pages = 1 } = {}) {
  const pageCount = Math.max(1, Math.min(5, Number(pages) || 1));
  const keyWord = String(keyword || '').trim().slice(0, 200);
  let saved = 0;

  for (let page = 1; page <= pageCount; page += 1) {
    await sleep(1100);
    const query = new URLSearchParams({
      page: String(page),
      size: '20',
      features: 'enable_category',
    });
    if (keyWord) query.set('keyWord', keyWord);
    const data = await cjFetch(`/product/listV2?${query.toString()}`);
    const items = productsFromList(data);
    if (!items.length) break;

    for (const item of items) {
      const pid = item.id || item.pid;
      if (!pid) continue;
      await sleep(1100);
      const detail = await cjFetch(`/product/query?pid=${encodeURIComponent(pid)}`);
      await sleep(1100);
      const stock = await cjFetch(`/product/stock/getInventoryByPid?pid=${encodeURIComponent(pid)}`);
      await upsertProduct(item, detail, stock);
      saved += 1;
    }
  }

  return { saved };
}

async function authStatus() {
  const row = await prisma.cjAuth.findUnique({ where: { id: AUTH_ID } });
  const count = await prisma.cjProduct.count();
  return {
    connected: Boolean(row && row.accessTokenExpiryDate.getTime() > Date.now()),
    keyConfigured: Boolean(process.env.CJ_API_KEY),
    productCount: count,
    accessTokenExpiryDate: row ? row.accessTokenExpiryDate : null,
  };
}

async function cjSend(path, { method = 'GET', body } = {}) {
  let token = await getAccessToken();
  try {
    return await cjRequest(path, { method, body, token });
  } catch (error) {
    if (Number(error.code) !== 1600001) throw error;
    const saved = await fetchTokenWithKey();
    return cjRequest(path, { method, body, token: saved.accessToken });
  }
}

module.exports = { syncCatalog, authStatus, cjSend };
