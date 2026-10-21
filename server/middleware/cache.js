const redisClient = require('../config/redis');
const logger = require('../config/logger');

// In-memory cache fallback
const memoryCache = new Map();

/**
 * Cache Middleware
 * Caches the JSON response of an endpoint for the specified duration.
 * Uses Redis if available, falls back to in-memory Map.
 * @param {number} duration - Time to live in seconds.
 */
const cacheResponse = (duration) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `store:cache:${req.originalUrl || req.url}`;

    try {
      let cachedData = null;

      if (redisClient.isReady) {
        cachedData = await redisClient.get(key);
      } else {
        const memEntry = memoryCache.get(key);
        if (memEntry && memEntry.expiry > Date.now()) {
          cachedData = memEntry.data;
        } else if (memEntry) {
          memoryCache.delete(key);
        }
      }

      if (cachedData) {
        // Cache Hit! Serve immediately
        res.setHeader('X-Cache', 'HIT');
        return res.status(200).json(JSON.parse(cachedData));
      }

      // Cache Miss! Intercept the response to save it
      res.setHeader('X-Cache', 'MISS');
      const originalJson = res.json.bind(res);
      
      res.json = (data) => {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const serializedData = JSON.stringify(data);
          if (redisClient.isReady) {
            redisClient.setEx(key, duration, serializedData)
              .catch(err => logger.error('Redis Set Error:', err));
          } else {
            memoryCache.set(key, {
              data: serializedData,
              expiry: Date.now() + (duration * 1000)
            });
          }
        }
        return originalJson(data);
      };

      next();
    } catch (error) {
      logger.error('Cache Middleware Error:', error);
      next(); // Continue even if cache fails
    }
  };
};

/**
 * Clear Cache Middleware
 * Clears cache for specific patterns (e.g., when a product is updated)
 * @param {string[]} patterns - Array of key patterns to invalidate (e.g., ['/api/products*'])
 */
const clearCache = (patterns) => {
  return async (req, res, next) => {
    // We execute the route first, THEN clear the cache if successful
    res.on('finish', async () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          if (redisClient.isReady) {
            for (const pattern of patterns) {
              const keys = await redisClient.keys(`store:cache:${pattern}`);
              if (keys.length > 0) {
                await redisClient.del(keys);
              }
            }
          } else {
            // In-memory pattern matching
            for (const pattern of patterns) {
              // Convert wildcard pattern to regex (basic implementation)
              const regexPattern = new RegExp('^store:cache:' + pattern.replace(/\*/g, '.*') + '$');
              for (const key of memoryCache.keys()) {
                if (regexPattern.test(key)) {
                  memoryCache.delete(key);
                }
              }
            }
          }
        } catch (error) {
          logger.error('Cache Invalidation Error:', error);
        }
      }
    });
    next();
  };
};

module.exports = { cacheResponse, clearCache };
