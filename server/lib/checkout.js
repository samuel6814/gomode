const crypto = require('crypto');
const prisma = require('./prisma');
const { readSale, salePriceFor } = require('./sale');
const { readPricing, cediPriceFor } = require('./cjPricing');
const { quoteFreight, createCjOrder, payCjBalance } = require('./cjOrders');
const { sendEmail } = require('../utils/mailer');

function makeOrderNumber() {
  return `BY-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
}

function httpError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function shippingCostFor({ deliveryMethod, region, city }) {
  if (deliveryMethod !== 'standard') return 0;
  if (!region) return 25;
  let feeRecord = null;
  if (city) {
    feeRecord = await prisma.deliveryFee.findFirst({ where: { region, city, isActive: true } });
  }
  if (!feeRecord) {
    feeRecord = await prisma.deliveryFee.findFirst({ where: { region, city: null, isActive: true } });
  }
  return feeRecord ? feeRecord.fee : 25;
}

async function pricedLines(lines) {
  const requested = Array.isArray(lines) ? lines : [];
  const buyyLines = [];
  const cjRequests = [];
  requested.forEach((line) => {
    const quantity = Math.max(1, Math.min(99, Number(line.quantity) || 1));
    if (line.source === 'cj' || line.cjVariantId) {
      cjRequests.push({ cjVariantId: line.cjVariantId, quantity });
    } else if (line.productId) {
      buyyLines.push({ productId: line.productId, quantity });
    }
  });
  if (!buyyLines.length && !cjRequests.length) throw httpError('The bag is empty', 400);

  const products = await prisma.product.findMany({
    where: { id: { in: [...new Set(buyyLines.map((line) => line.productId))] }, isActive: true },
  });
  const byId = new Map(products.map((product) => [product.id, product]));
  const sale = await readSale();
  const localItems = buyyLines.map((line) => {
    const product = byId.get(line.productId);
    if (!product) throw httpError('A product in the bag is no longer available', 400);
    if (product.stock < line.quantity) throw httpError(`${product.name} does not have enough stock`, 400);
    return {
      source: 'buyy',
      productId: product.id,
      cjVariantId: null,
      vid: null,
      name: product.name,
      price: salePriceFor(product, sale),
      quantity: line.quantity,
    };
  });

  const variants = await prisma.cjVariant.findMany({
    where: { id: { in: [...new Set(cjRequests.map((line) => line.cjVariantId).filter(Boolean))] } },
    include: { product: true },
  });
  const byVariant = new Map(variants.map((variant) => [variant.id, variant]));
  const pricing = await readPricing();
  const cjItems = cjRequests.map((line) => {
    const variant = byVariant.get(line.cjVariantId);
    if (!variant || !variant.product?.isActive) throw httpError('A CJ special in the bag is no longer available', 400);
    if (!variant.vid) throw httpError(`${variant.product.name} has no variant to order`, 400);
    const label = variant.optionLabel ? `${variant.product.name} (${variant.optionLabel})` : variant.product.name;
    return {
      source: 'cj',
      productId: null,
      cjVariantId: variant.id,
      vid: variant.vid,
      name: label,
      price: cediPriceFor(variant.price || variant.product.price, pricing),
      quantity: line.quantity,
    };
  });

  return { items: [...localItems, ...cjItems], hasLocal: localItems.length > 0 };
}

async function priceCheckout({ lines, deliveryMethod, region, city, country, zip }) {
  const priced = await pricedLines(lines);
  const localShipping = priced.hasLocal
    ? await shippingCostFor({ deliveryMethod, region, city })
    : 0;
  const cjLines = priced.items.filter((item) => item.source === 'cj');
  const freight = cjLines.length
    ? await quoteFreight(cjLines, country || 'Ghana', zip)
    : { logisticName: '', shippingCedis: 0 };
  const subtotal = priced.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = Math.round((localShipping + freight.shippingCedis) * 100) / 100;
  const totalAmount = Math.round((subtotal + shippingCost) * 100) / 100;
  return {
    items: priced.items,
    shippingCost,
    localShipping,
    logisticName: freight.logisticName,
    deliveryMethod,
    region,
    city,
    totalAmount,
  };
}

function addressFrom(details, fallbackEmail) {
  return {
    name: details?.name || 'N/A',
    email: details?.email || fallbackEmail,
    phone: details?.phone || 'N/A',
    street: details?.street || 'N/A',
    city: details?.city || 'N/A',
    region: details?.region || 'N/A',
    zipCode: details?.zipCode || 'N/A',
    country: details?.country || 'Ghana',
  };
}

function addressReady(address) {
  return Boolean(address?.street && address.street !== 'N/A' && address.email);
}

async function notifyPaid(order, reference, amount, io) {
  if (io) {
    io.emit('admin_notification', {
      type: 'NEW_ORDER',
      message: `New Order Received! (${reference})`,
      amount,
    });
  }
  try {
    const { buildOrderConfirmationEmail, buildAdminOrderNotification } = require('../utils/emailTemplates');
    const formatted = {
      id: order.orderNumber,
      transactionRef: reference,
      paymentMethod: order.paymentMethod,
      status: 'Confirmed',
      items: order.items.map((item) => ({
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
      })),
    };
    const email = order.shippingAddress?.email;
    if (email) {
      await sendEmail(email, 'Order Confirmation - buyy', buildOrderConfirmationEmail(formatted, amount));
    }
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    if (adminEmail) {
      await sendEmail(adminEmail, `New Order Received! ${reference}`, buildAdminOrderNotification(formatted, amount));
    }
  } catch (error) {
    console.error('Confirmation email failed (non-blocking):', error.message);
  }
}

async function placeCjOrder(order) {
  const cjItems = order.items.filter((item) => item.source === 'cj' && item.vid);
  if (!cjItems.length || order.cjOrderId) return order;
  const address = order.shippingAddress;
  if (!addressReady(address)) return order;

  const locked = await prisma.order.updateMany({
    where: { id: order.id, cjOrderId: null, cjStatus: { in: ['', 'FAILED'] } },
    data: { cjStatus: 'PLACING' },
  });
  if (locked.count !== 1) {
    return prisma.order.findUnique({
      where: { id: order.id },
      include: { items: true, shippingAddress: true },
    });
  }

  try {
    const created = await createCjOrder({
      orderNumber: order.orderNumber,
      lines: cjItems,
      address,
      logisticName: order.logisticName,
    });
    if (!created.sandbox && created.cjOrderId) {
      await payCjBalance(created.cjOrderId);
    }
    return prisma.order.update({
      where: { id: order.id },
      data: {
        cjOrderId: created.cjOrderId || null,
        cjStatus: created.sandbox ? 'SANDBOX' : 'PAID',
      },
      include: { items: true, shippingAddress: true },
    });
  } catch (error) {
    console.error('CJ order create failed:', error.message);
    return prisma.order.update({
      where: { id: order.id },
      data: { cjStatus: 'FAILED' },
      include: { items: true, shippingAddress: true },
    });
  }
}

async function fulfillReference({ reference, shippingDetails, io }) {
  const existing = await prisma.order.findUnique({
    where: { transactionRef: reference },
    include: { items: true, shippingAddress: true },
  });
  if (existing) {
    if (shippingDetails?.street && existing.shippingAddress?.street === 'N/A') {
      await prisma.shippingAddress.update({
        where: { orderId: existing.id },
        data: addressFrom(shippingDetails, existing.shippingAddress.email),
      });
    }
    const refreshed = await prisma.order.findUnique({
      where: { id: existing.id },
      include: { items: true, shippingAddress: true },
    });
    const withCj = await placeCjOrder(refreshed);
    return { order: withCj, already: true };
  }

  const pending = await prisma.pendingPayment.findUnique({ where: { reference } });
  if (!pending) throw httpError('Checkout session was not found', 400);

  const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
  });
  const data = await paystackResponse.json();
  if (!data.status || data.data?.status !== 'success') {
    throw httpError('Payment was not successful', 400);
  }
  if (Number(data.data.amount) !== Math.round(pending.amount * 100)) {
    throw httpError('Amount paid does not match the bag', 400);
  }

  const snapshot = JSON.parse(pending.payload);
  const paymentMethod = data.data.channel || 'unknown';
  let orderNumber = makeOrderNumber();
  const taken = await prisma.order.findUnique({ where: { orderNumber } });
  if (taken) orderNumber = makeOrderNumber();
  const address = addressFrom(shippingDetails, pending.email);
  if (!shippingDetails?.city && snapshot.city) address.city = snapshot.city;
  if (!shippingDetails?.region && snapshot.region) address.region = snapshot.region;

  let order;
  try {
    order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber,
          userId: pending.userId,
          status: 'PENDING',
          totalAmount: pending.amount,
          transactionRef: reference,
          paymentStatus: 'SUCCESS',
          paymentMethod,
          logisticName: snapshot.logisticName || null,
          shippingAddress: { create: address },
          items: {
            create: snapshot.items.map((item) => ({
              source: item.source || 'buyy',
              productId: item.productId || null,
              cjVariantId: item.cjVariantId || null,
              vid: item.vid || null,
              productName: item.name,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: { items: true, shippingAddress: true },
      });

      await Promise.all(snapshot.items.filter((item) => item.source !== 'cj' && item.productId).map(async (item) => {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (product && product.stock >= item.quantity) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }));

      if (pending.userId) {
        const cart = await tx.cart.findFirst({ where: { userId: pending.userId } });
        if (cart) await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      }
      await tx.pendingPayment.delete({ where: { id: pending.id } });
      return created;
    }, { maxWait: 5000, timeout: 20000 });
  } catch (error) {
    if (error.code !== 'P2002') throw error;
    order = await prisma.order.findUnique({
      where: { transactionRef: reference },
      include: { items: true, shippingAddress: true },
    });
    return { order, already: true };
  }

  await notifyPaid(order, reference, pending.amount, io);
  const withCj = await placeCjOrder(order);
  return { order: withCj, already: false };
}

module.exports = {
  priceCheckout,
  fulfillReference,
};
