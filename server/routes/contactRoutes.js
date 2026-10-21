const express = require('express');
const router = express.Router();

const { isAdmin } = require('../middleware/auth');
const prisma = require('../lib/prisma');

const COMMISSION_SUBJECT = 'Commission Inquiry';
const VALID_STATUSES = ['UNREAD', 'READ', 'REPLIED'];

// Public route: Customers submit a message
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required',
      });
    }

    await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        message,
      },
    });

    const { sendEmail } = require('../utils/mailer');
    const {
      buildContactUserEmail,
      buildContactAdminEmail,
    } = require('../utils/emailTemplates');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';

    const userEmailHtml = buildContactUserEmail(name);
    await sendEmail(
      email,
      'We received your message - Your Brand',
      userEmailHtml
    );

    if (adminEmail) {
      const adminEmailHtml = buildContactAdminEmail(
        name,
        email,
        subject,
        message
      );
      await sendEmail(
        adminEmail,
        `New Contact Form Submission: ${subject || 'No subject'}`,
        adminEmailHtml
      );
    }

    res
      .status(201)
      .json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Contact POST error:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to send message' });
  }
});

// Admin route: list messages (optional ?type=commission filter)
router.get('/', isAdmin, async (req, res) => {
  try {
    const where =
      req.query.type === 'commission'
        ? { subject: COMMISSION_SUBJECT }
        : {};

    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error('Contact GET error:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch messages' });
  }
});

// Admin route: single message
router.get('/:id', isAdmin, async (req, res) => {
  try {
    const message = await prisma.contactMessage.findUnique({
      where: { id: req.params.id },
    });
    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: 'Not found' });
    }
    res.status(200).json({ success: true, data: message });
  } catch (error) {
    console.error('Contact GET :id error:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch message' });
  }
});

// Admin route: update status
router.patch('/:id', isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!VALID_STATUSES.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid status' });
    }

    const updated = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('Contact PATCH error:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to update message' });
  }
});

module.exports = router;
