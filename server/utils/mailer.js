const nodemailer = require('nodemailer');
const logger = require('../config/logger');

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS, 
  },
});

/**
 * Send an email using the configured SMTP server.
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - HTML body content
 */
const sendEmail = async (to, subject, html) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      logger.warn('SMTP credentials not configured. Skipping email dispatch.');
      return;
    }

    const info = await transporter.sendMail({
      from: `"Your Brand" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    logger.info(`Email sent successfully to ${to} (Message ID: ${info.messageId})`);
    return info;
  } catch (error) {
    logger.error(`Error sending email to ${to}:`, error);
    // Don't throw the error so that the main flow (like checkout) doesn't break
    // if email sending fails.
  }
};

module.exports = { sendEmail };
