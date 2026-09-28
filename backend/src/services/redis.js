/**
 * Redis client service
 * Provides a clean abstraction over the Redis client.
 * Used for: dashboard caching, rate limit tracking, session data.
 */
const { createClient } = require('redis');
const config = require('../config/env');
const logger = require('../utils/logger');

let client = null;
let isConnected = false;

/**
 * Initialize and return the Redis client (singleton)
 */
async function getClient() {
  if (client && isConnected) {
    return client;
  }

  client = createClient({
    url: config.redisUrl,
    password: config.redisPassword || undefined,
    socket: {
      connectTimeout: 5000,
      reconnectStrategy: (retries) => {
        if (retries > 5) {
          logger.warn('Redis reconnection attempts exceeded, giving up');
          return false;
        }
        return Math.min(retries * 100, 3000);
      },
    },
  });

  client.on('connect', () => {
    isConnected = true;
    logger.info('Redis connected');
  });

  client.on('disconnect', () => {
    isConnected = false;
    logger.warn('Redis disconnected');
  });

  client.on('error', (err) => {
    isConnected = false;
    logger.error('Redis error', { error: err.message });
  });

  try {
    await client.connect();
  } catch (error) {
    logger.error('Redis connection failed', { error: error.message });
    isConnected = false;
  }

  return client;
}

/**
 * Test Redis connection
 */
async function testConnection() {
  try {
    const c = await getClient();
    if (!isConnected) return false;
    await c.ping();
    return true;
  } catch (error) {
    logger.error('Redis ping failed', { error: error.message });
    return false;
  }
}

/**
 * Set a key with optional TTL
 * @param {string} key
 * @param {*} value - Will be JSON serialized
 * @param {number} ttlSeconds
 */
async function set(key, value, ttlSeconds = null) {
  try {
    const c = await getClient();
    if (!isConnected) return false;
    const serialized = JSON.stringify(value);
    if (ttlSeconds) {
      await c.setEx(key, ttlSeconds, serialized);
    } else {
      await c.set(key, serialized);
    }
    return true;
  } catch (error) {
    logger.error('Redis SET error', { key, error: error.message });
    return false;
  }
}

/**
 * Get a key
 * @param {string} key
 * @returns {*} Parsed value or null
 */
async function get(key) {
  try {
    const c = await getClient();
    if (!isConnected) return null;
    const value = await c.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    logger.error('Redis GET error', { key, error: error.message });
    return null;
  }
}

/**
 * Delete a key or pattern
 * @param {string} key
 */
async function del(key) {
  try {
    const c = await getClient();
    if (!isConnected) return false;
    await c.del(key);
    return true;
  } catch (error) {
    logger.error('Redis DEL error', { key, error: error.message });
    return false;
  }
}

/**
 * Invalidate all keys matching a pattern
 * @param {string} pattern - e.g. 'dashboard:*'
 */
async function invalidatePattern(pattern) {
  try {
    const c = await getClient();
    if (!isConnected) return false;
    const keys = await c.keys(pattern);
    if (keys.length > 0) {
      await c.del(keys);
    }
    return true;
  } catch (error) {
    logger.error('Redis pattern invalidation error', { pattern, error: error.message });
    return false;
  }
}

/**
 * Increment a counter (for rate limiting)
 * @param {string} key
 * @param {number} ttlSeconds
 */
async function increment(key, ttlSeconds = null) {
  try {
    const c = await getClient();
    if (!isConnected) return null;
    const value = await c.incr(key);
    if (value === 1 && ttlSeconds) {
      await c.expire(key, ttlSeconds);
    }
    return value;
  } catch (error) {
    logger.error('Redis INCR error', { key, error: error.message });
    return null;
  }
}

/**
 * Check if Redis is connected
 */
function isRedisConnected() {
  return isConnected;
}

/**
 * Gracefully close the Redis connection
 */
async function closeConnection() {
  if (client && isConnected) {
    await client.quit();
    isConnected = false;
    logger.info('Redis connection closed');
  }
}

module.exports = {
  getClient,
  testConnection,
  set,
  get,
  del,
  invalidatePattern,
  increment,
  isRedisConnected,
  closeConnection,
};
