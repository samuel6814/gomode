const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F8F9FA; color: #111827; margin: 0; padding: 20px 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
    .header { background-color: #111827; padding: 30px 20px; text-align: center; }
    .header h1 { color: #FFFFFF; margin: 0; font-family: serif; font-size: 28px; letter-spacing: 1px; text-transform: uppercase; }
    .content { padding: 30px; line-height: 1.6; font-size: 15px; }
    .footer { background-color: #F8F9FA; padding: 20px; text-align: center; font-size: 12px; color: #9CA3AF; border-top: 1px solid #E5E7EB; }
    .btn { display: inline-block; background-color: #4b76fc; color: #FFFFFF !important; text-decoration: none; padding: 12px 25px; border-radius: 50px; font-weight: bold; margin-top: 20px; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; }
    h2 { color: #111827; font-size: 20px; margin-top: 0; }
    p { margin-bottom: 15px; }
    .accent { color: #4b76fc; font-weight: bold; }
    .box { background-color: #F8F9FA; border-left: 4px solid #4b76fc; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { text-align: left; padding: 10px; border-bottom: 2px solid #E5E7EB; color: #6B7280; font-size: 12px; text-transform: uppercase; }
    td { padding: 10px; border-bottom: 1px solid #E5E7EB; }
    .total-row td { font-weight: bold; border-top: 2px solid #111827; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Brand</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Your Brand. All rights reserved.<br>
      This is an automated message, please do not reply directly to this email.
    </div>
  </div>
</body>
</html>
`;

const buildOrderConfirmationEmail = (order, totalAmount) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td>${item.productName || 'Product'}</td>
      <td>x${item.quantity}</td>
      <td style="text-align: right;">GH₵ ${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  const content = `
    <h2>Order Confirmed! 🎉</h2>
    <p>Hi there,</p>
    <p>Thank you for shopping with <span class="accent">Your Brand</span>. We've received your order and are getting it ready for shipment.</p>
    
    <div class="box">
      <strong>Order Reference:</strong> ${order.transactionRef}<br>
      <strong>Payment Method:</strong> ${order.paymentMethod}<br>
      <strong>Status:</strong> ${order.status}
    </div>

    <h3>Order Details</h3>
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th style="text-align: right;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
        <tr class="total-row">
          <td colspan="2">Total (incl. delivery)</td>
          <td style="text-align: right;">GH₵ ${Number(totalAmount).toFixed(2)}</td>
        </tr>
      </tbody>
    </table>

    <p>We will notify you again when your package is out for delivery.</p>
    <p>Stay gorgeous,<br>The Team at Your Brand</p>
  `;

  return baseTemplate(content);
};

const buildAdminOrderNotification = (order, totalAmount) => {
  const content = `
    <h2>New Order Received 🛍️</h2>
    <p>A new order has been placed on the storefront.</p>
    
    <div class="box">
      <strong>Order ID:</strong> ${order.id}<br>
      <strong>Reference:</strong> ${order.transactionRef}<br>
      <strong>Total Value:</strong> GH₵ ${Number(totalAmount).toFixed(2)}<br>
      <strong>Payment Method:</strong> ${order.paymentMethod}
    </div>

    <a href="https://example.com/admin/orders" class="btn">View Order Dashboard</a>
  `;

  return baseTemplate(content);
};

const buildContactUserEmail = (name) => {
  const content = `
    <h2>We've Received Your Message! 💌</h2>
    <p>Hi ${name},</p>
    <p>Thank you for reaching out to <span class="accent">Your Brand</span>. This email is just to confirm that we have successfully received your message.</p>
    <p>Our support team will review your inquiry and get back to you as soon as possible, usually within 24 hours.</p>
    <p>In the meantime, feel free to browse our latest drops!</p>
    
    <a href="https://example.com/shop" class="btn">Shop Now</a>

    <p>Best,<br>The Team at Your Brand</p>
  `;

  return baseTemplate(content);
};

const buildContactAdminEmail = (name, email, subject, message) => {
  const content = `
    <h2>New Contact Form Submission 📬</h2>
    <p>A customer has submitted a new inquiry via the contact form.</p>
    
    <div class="box">
      <strong>Name:</strong> ${name}<br>
      <strong>Email:</strong> ${email}<br>
      <strong>Subject:</strong> ${subject}
    </div>

    <h3>Message:</h3>
    <p style="background-color: #F3F4F6; padding: 15px; border-radius: 8px; white-space: pre-wrap;">${message}</p>

    <p>Please reply to the customer directly at <a href="mailto:${email}" style="color: #4b76fc;">${email}</a>.</p>
  `;

  return baseTemplate(content);
};

const buildForgotPasswordEmail = (token) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FAFAFA; color: #333333; margin: 0; padding: 40px 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #FFD1DC; }
    .header { background-color: #FFFFFF; padding: 40px 20px 20px; text-align: center; border-bottom: 1px solid #FFD1DC; }
    .header h1 { color: #111827; margin: 0; font-family: 'Helvetica Neue', sans-serif; font-weight: 300; font-size: 24px; letter-spacing: 2px; text-transform: uppercase; }
    .content { padding: 40px; line-height: 1.8; font-size: 15px; text-align: center; }
    .footer { background-color: #FAFAFA; padding: 30px; text-align: center; font-size: 12px; color: #9CA3AF; border-top: 1px solid #FFD1DC; }
    .btn { display: inline-block; background-color: #FF69B4; color: #FFFFFF !important; text-decoration: none; padding: 14px 35px; border-radius: 50px; font-weight: 600; margin-top: 25px; text-transform: uppercase; font-size: 13px; letter-spacing: 1.5px; transition: background-color 0.3s; box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3); }
    h2 { color: #111827; font-size: 22px; margin-top: 0; font-weight: 400; }
    p { margin-bottom: 20px; color: #4B5563; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Brand</h1>
    </div>
    <div class="content">
      <h2>Password Reset Request</h2>
      <p>We received a request to reset the password for your Your Brand store account. If you made this request, please click the button below to set a new password.</p>
      
      <a href="${resetUrl}" class="btn">Reset My Password</a>

      <p style="margin-top: 30px; font-size: 13px; color: #6B7280;">If you didn't request a password reset, you can safely ignore this email. This link will expire in 15 minutes.</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Your Brand. All rights reserved.<br>
      For any assistance, please contact our support team.
    </div>
  </div>
</body>
</html>
  `;
};

module.exports = {
  buildOrderConfirmationEmail,
  buildAdminOrderNotification,
  buildContactUserEmail,
  buildContactAdminEmail,
  buildForgotPasswordEmail
};
