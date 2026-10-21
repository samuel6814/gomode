const { createClient } = require('redis');
const logger = require('./logger');

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: false // Prevent infinite reconnection spam when Redis is down
  }
});

redisClient.on('error', (err) => {
  // Silence ECONNREFUSED so it doesn't scare the user when running without Redis locally
  if (err.code !== 'ECONNREFUSED') {
    logger.error('Redis Client Error', err);
  }
});

redisClient.on('connect', () => logger.info('Redis Client Connected'));

// Connect immediately, but don't crash if it fails
(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    if (err.code !== 'ECONNREFUSED') {
      logger.error('Failed to connect to Redis on startup. Caching may be disabled.', err);
    } else {
      logger.info('Running without Redis cache (Local Redis not found).');
    }
  }
})();

module.exports = redisClient;
