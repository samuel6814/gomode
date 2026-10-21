require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');               
const cookieParser = require('cookie-parser');  
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const http = require('http');
const { Server } = require('socket.io');
const logger = require('./config/logger');
const errorHandler = require('./middleware/errorHandler');
const { initCronJobs } = require('./cron/dashboardCron');
const { auth } = require('./auth/auth');
const { toNodeHandler } = require('better-auth/node'); 
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const customerRoutes = require('./routes/customerRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const heroConfigRoutes = require('./routes/heroConfigRoutes');
const galleryConfigRoutes = require('./routes/galleryConfigRoutes');
const imageRoutes = require('./routes/imageRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const contactRoutes = require('./routes/contactRoutes');
const searchRoutes = require('./routes/searchRoutes');
const userRoutes = require('./routes/userRoutes');
const customAuthRoutes = require('./routes/customAuthRoutes');
// temp
const { isAuthenticated, isAdmin } = require('./middleware/auth');



const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.indexOf(origin) !== -1 || 
        origin === 'null' ||
        /\.vercel\.app$/.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Pass io to routes by storing it globally or on app
app.set('io', io);

io.on('connection', (socket) => {
  console.log('Admin Dashboard connected to WebSockets:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// This tells Express to trust the Render Load Balancer and read the user's real IP
app.set('trust proxy', 1); 

// We explicitly list all common React/Vite/LiveServer ports here
const allowedOrigins = [
  'http://localhost:5173', // Vite default
  'http://localhost:3000', // Create React App default
  'http://127.0.0.1:5500', // VS Code Live Server
  'http://localhost:5500', // VS Code Live Server
  'http://localhost:5000', 
  'null'                   // Local HTML files
];

// If you have a custom URL in your .env, add it safely to the list
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

const requestTracer = require('./middleware/requestTracer');

// --- 1. Global Middleware ---
app.use(compression());
app.use(requestTracer);
app.use(morgan('dev')); 
app.use(express.json({
  verify: (req, _res, buf) => {
    if (req.originalUrl.startsWith('/api/payments/webhook')) req.rawBody = buf;
  },
}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin === 'null' ||
      /\.vercel\.app$/.test(origin)
    ) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Healthcheck endpoint to prevent Render cold starts
app.get('/api/healthz', (req, res) => {
  res.status(200).send('OK');
});

// --- 2. Global Rate Limiter ---
// Prevent DDoS attacks: Max 100 requests per IP per minute
const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, 
  message: { success: false, message: 'Too many requests from this IP, please try again after a minute' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', globalLimiter);

// --- 3. Health Check Route ---
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Your Brand API Gateway is running' });
});

// --- 4. API Routes ---

// Stricter rate limit for auth endpoints (20 requests per minute per IP)
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many authentication attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Custom auth routes (forgot-password, reset-password)
app.use("/api/auth", authLimiter, customAuthRoutes);

// Better-auth handler — CORS is already applied globally above
app.use("/api/auth", authLimiter, toNodeHandler(auth));

// C. Future Routes (To be implemented in Phase 3 & 4)
const cjRoutes = require('./routes/cjRoutes');
app.use('/api/admin/cj', cjRoutes.adminRouter);
app.use('/api/admin', adminRoutes);

// --- TEST ROUTES ---
app.get('/api/test/public', (req, res) => {
  res.json({ message: "Anyone can see this!" });
});

app.get('/api/test/protected', isAuthenticated, (req, res) => {
  res.json({ message: "You are logged in!", user: req.user });
});

app.get('/api/test/admin', isAdmin, (req, res) => {
  res.json({ message: "Welcome to the Admin Dashboard!", user: req.user });
});

// --- Core App Routes ---
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/admin/settings', settingsRoutes);
app.use('/api/admin/notifications', notificationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/admin/customers', customerRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api', heroConfigRoutes);
app.use('/api', galleryConfigRoutes);
app.use('/api/admin/images', imageRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/sales', require('./routes/salesRoutes'));
app.use('/api/cj', cjRoutes.publicRouter);
app.use('/api/users', userRoutes);

// --- 5. 404 Route Fallback (MUST be at the bottom of the routes) ---
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

// --- 6. Centralized Error Handling ---
app.use(errorHandler);

// --- Server Startup ---
const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  initCronJobs();
});