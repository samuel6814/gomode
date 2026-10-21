const crypto = require('crypto');
const logger = require('../config/logger');

const requestTracer = (req, res, next) => {
  // Generate a unique ID for the request
  req.requestId = crypto.randomUUID();
  res.setHeader('X-Request-Id', req.requestId);

  const start = Date.now();

  // Log request start
  logger.info(`[${req.requestId}] Started ${req.method} ${req.originalUrl || req.url}`);

  // Listen for the response finish event
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`[${req.requestId}] Completed ${res.statusCode} in ${duration}ms`);
  });

  next();
};

module.exports = requestTracer;
