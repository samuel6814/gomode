const express = require('express');
const crypto = require('crypto');
const { hashPassword } = require('better-auth/crypto');
const { PrismaClient } = require('@prisma/client');
const redisClient = require('../config/redis');
const { sendEmail } = require('../utils/mailer');
const { buildForgotPasswordEmail } = require('../utils/emailTemplates');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // 1. Validate email exists in PostgreSQL
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      // Return success anyway to prevent email enumeration attacks
      return res.status(200).json({ success: true, message: 'If that email exists, a reset link has been sent.' });
    }

    // 2. Assert record does not contain ADMIN role
    if (user.role === 'ADMIN' || user.email === 'admin@example.com') {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin credentials must be managed via direct server configuration for security compliance.' 
      });
    }

    // 3. Generate a secure, unique hex token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // 4. Cache token in Redis with 15-minute TTL (900 seconds)
    // Upstash / Redis is strictly required for this. If it fails, it will hit the catch block.
    if (!redisClient.isReady) {
      return res.status(503).json({ success: false, message: 'Caching service unavailable. Please try again later.' });
    }
    
    await redisClient.setEx(`pwd_reset:${resetToken}`, 900, user.id);

    // 5. Fire the asynchronous Nodemailer service
    const emailHtml = buildForgotPasswordEmail(resetToken);
    
    // Send email asynchronously (don't await so we don't block response, unless we want to ensure delivery)
    // Actually, better to await so if it fails, we inform the user
    try {
      await sendEmail(user.email, 'Password Reset Request - Your Brand', emailHtml);
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
      return res.status(500).json({ success: false, message: 'Failed to send email. Please try again.' });
    }

    res.status(200).json({ success: true, message: 'If that email exists, a reset link has been sent.' });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'An internal server error occurred' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Token and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
    }

    if (!redisClient.isReady) {
      return res.status(503).json({ success: false, message: 'Caching service unavailable. Please try again later.' });
    }

    // 1. Verify token existence and validity inside Redis
    const userId = await redisClient.get(`pwd_reset:${token}`);

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Invalid or expired reset token' });
    }

    // 2. Hash the newPassword using better-auth's native crypto
    const hashedPassword = await hashPassword(newPassword);

    // 3. Update the matching record in PostgreSQL
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedPassword }
    });

    const account = await prisma.account.findFirst({
      where: { userId: userId, providerId: 'credential' }
    });

    if (account) {
      await prisma.account.update({
        where: { id: account.id },
        data: { password: hashedPassword }
      });
    } else {
      await prisma.account.create({
        data: {
          accountId: userId,
          providerId: 'credential',
          userId: userId,
          password: hashedPassword
        }
      });
    }

    // 4. Invalidate and delete the consumed token from Redis immediately
    await redisClient.del(`pwd_reset:${token}`);

    res.status(200).json({ success: true, message: 'Password has been reset successfully. You can now log in.' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'An internal server error occurred' });
  }
});

module.exports = router;
