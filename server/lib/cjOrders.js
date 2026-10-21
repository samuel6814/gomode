const { cjSend } = require('./cj');
const { readPricing } = require('./cjPricing');

function countryCode(name) {
  const value = String(name || '').trim().toLowerCase();
  const map = {
    ghana: 'GH',
    nigeria: 'NG',
    'united states': 'US',
    usa: 'US',
    'united kingdom': 'GB',
    uk: 'GB',
  };
  if (map[value]) return map[value];
  if (/^[a-z]{2}$/i.test(String(name || '').trim())) return String(name).trim().toUpperCase();
  return 'GH';
}

function asList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.list)) return data.list;
  if (Array.isArray(data?.logistics)) return data.logistics;
  return [];
}

function usd(value) {
  const match = String(value ?? '').match(/[\d.]+/);
  return match ? Number(match[0]) : 0;
}

function paystackIsTest() {
  return String(process.env.PAYSTACK_SECRET_KEY || '').startsWith('sk_test_');
}

async function quoteFreight(lines, country, zip) {
  const data = await cjSend('/logistic/freightCalculate', {
    method: 'POST',
    body: {
      startCountryCode: 'CN',
      endCountryCode: countryCode(country),
      zip: zip || undefined,
      products: lines.map((line) => ({ vid: line.vid, quantity: line.quantity })),
    },
  });
  const options = asList(data).filter((option) => option.logisticName);
  if (!options.length) {
    const error = new Error('No CJ shipping option is available for that address');
    error.status = 400;
    throw error;
  }
  options.sort((a, b) => usd(a.logisticPrice) - usd(b.logisticPrice));
  const chosen = options[0];
  const pricing = await readPricing();
  const shippingCedis = Math.round(usd(chosen.logisticPrice) * pricing.usdToGhs * 100) / 100;
  return { logisticName: chosen.logisticName, shippingCedis };
}

function idFrom(data) {
  if (!data) return '';
  if (typeof data === 'string') return data;
  return String(data.orderId || data.cjOrderId || data.orderNum || data.orderNumber || '');
}

async function createCjOrder({ orderNumber, lines, address, logisticName }) {
  const sandbox = paystackIsTest();
  const data = await cjSend('/shopping/order/createOrderV3', {
    method: 'POST',
    body: {
      orderNumber,
      shippingZip: address.zipCode || '',
      shippingCountry: address.country || 'Ghana',
      shippingCountryCode: countryCode(address.country),
      shippingProvince: address.region || '',
      shippingCity: address.city || '',
      shippingAddress: address.street || '',
      shippingCustomerName: address.name || '',
      shippingPhone: address.phone || '',
      email: address.email || '',
      shopLogisticsType: 2,
      logisticName,
      fromCountryCode: 'CN',
      payType: 3,
      orderFlow: 1,
      isSandbox: sandbox ? 1 : 0,
      products: lines.map((line) => ({ vid: line.vid, quantity: line.quantity })),
    },
  });
  return { cjOrderId: idFrom(data), sandbox };
}

async function payCjBalance(cjOrderId) {
  await cjSend('/shopping/pay/getBalance');
  await cjSend('/shopping/order/addCart', {
    method: 'POST',
    body: { cjOrderIdList: [cjOrderId] },
  });
  await cjSend('/shopping/order/addCartConfirm', {
    method: 'POST',
    body: { cjOrderIdList: [cjOrderId] },
  });
  const parent = await cjSend('/shopping/order/saveGenerateParentOrder', {
    method: 'POST',
    body: { cjOrderIdList: [cjOrderId] },
  });
  const shipmentOrderId = parent?.shipmentOrderId || parent?.payId || parent?.orderId || '';
  await cjSend('/shopping/pay/payBalanceV2', {
    method: 'POST',
    body: shipmentOrderId ? { shipmentOrderId } : { cjOrderIdList: [cjOrderId] },
  });
}

function trackingFrom(data) {
  if (!data || typeof data !== 'object') return { number: '', url: '' };
  return {
    number: String(data.trackNumber || data.trackingNumber || data.logisticTrackNumber || ''),
    url: String(data.trackingUrl || data.trackUrl || ''),
  };
}

async function fetchCjTracking(cjOrderId) {
  const data = await cjSend(`/shopping/order/getOrderDetail?orderId=${encodeURIComponent(cjOrderId)}`);
  return trackingFrom(data);
}

module.exports = {
  quoteFreight,
  createCjOrder,
  payCjBalance,
  fetchCjTracking,
  paystackIsTest,
};
