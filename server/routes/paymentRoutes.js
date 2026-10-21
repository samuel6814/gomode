const express = require('express');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const prisma = require('../lib/prisma');
const { optionalAuth } = require('../middleware/auth');
const { priceCheckout, fulfillReference } = require('../lib/checkout');

const router = express.Router();

const paymentLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many payment requests. Please wait a moment.' },
  standardHeaders: true,
  legacyHeaders: false,
});

function signaturesMatch(rawBody, signature) {
  const secret = process.env.PAYSTACK_SECRET_KEY || '';
  if (!rawBody || !signature || !secret) return false;
  const digest = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');
  const left = Buffer.from(digest);
  const right = Buffer.from(String(signature));
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

router.post('/initialize', paymentLimiter, optionalAuth, async (req, res) => {
  try {
    const { deliveryMethod, region, city, country, zip, email, items } = req.body;
    let lines;

    if (req.user) {
      const cart = await prisma.cart.findFirst({
        where: { userId: req.user.id },
        include: { items: true },
      });
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ success: false, message: 'Cart is empty' });
      }
      lines = cart.items.map((item) => ({
        source: item.source,
        productId: item.productId,
        cjVariantId: item.cjVariantId,
        quantity: item.quantity,
      }));
    } else {
      if (!email || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: 'Email and bag items are required' });
      }
      lines = items;
    }

    const priced = await priceCheckout({
      lines,
      deliveryMethod,
      region,
      city,
      country: country || 'Ghana',
      zip,
    });
    const amountInBaseUnits = Math.round(priced.totalAmount * 100);
    const reference = `GF-${crypto.randomUUID()}`;
    const payerEmail = req.user?.email || email;

    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: payerEmail,
        amount: amountInBaseUnits,
        reference,
        channels: ['card', 'mobile_money'],
      }),
    });

    const data = await paystackResponse.json();
    if (!data.status) {
      return res.status(500).json({ success: false, message: 'Failed to initialize Paystack', error: data.message });
    }

    await prisma.pendingPayment.create({
      data: {
        reference,
        email: payerEmail,
        userId: req.user?.id || null,
        amount: priced.totalAmount,
        payload: JSON.stringify({
          items: priced.items,
          shippingCost: priced.shippingCost,
          localShipping: priced.localShipping,
          logisticName: priced.logisticName,
          deliveryMethod,
          region,
          city,
        }),
      },
    });

    res.status(200).json({
      success: true,
      access_code: data.data.access_code,
      reference,
      totalAmount: priced.totalAmount,
      publicKey: process.env.PAYSTACK_PUBLIC_KEY || '',
    });
  } catch (error) {
    console.error('Paystack Init Error:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.status ? error.message : 'Server error during initialization',
    });
  }
});

router.post('/verify', paymentLimiter, optionalAuth, async (req, res) => {
  try {
    const { reference, shippingDetails } = req.body;
    if (!reference) return res.status(400).json({ success: false, message: 'Reference is required' });

    const { order, already } = await fulfillReference({
      reference,
      shippingDetails,
      io: req.app.get('io'),
    });

    res.status(200).json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      order,
      message: already ? 'Already processed' : undefined,
    });
  } catch (error) {
    console.error('Paystack Verify Error:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.status ? error.message : 'Fulfillment failed',
    });
  }
});

router.post('/webhook', async (req, res) => {
  try {
    if (!signaturesMatch(req.rawBody, req.headers['x-paystack-signature'])) {
      return res.status(401).send('Invalid signature');
    }
    const event = req.body;
    if (event?.event !== 'charge.success' || !event.data?.reference) {
      return res.status(200).send('Ignored');
    }
    await fulfillReference({
      reference: event.data.reference,
      shippingDetails: null,
      io: req.app.get('io'),
    });
    res.status(200).send('OK');
  } catch (error) {
    console.error('Paystack Webhook Error:', error);
    if (error.status && error.status < 500) return res.status(200).send('Ignored');
    res.status(500).send('Retry');
  }
});

module.exports = router;
