/**
 * Environment configuration
 * All configuration is loaded from environment variables to support
 * container-friendly, cloud-agnostic deployment.
 */
const dotenv = require('dotenv');
dotenv.config();

const config = {
  // Server
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/cloudswitch',
  dbPoolMin: parseInt(process.env.DB_POOL_MIN || '2', 10),
  dbPoolMax: parseInt(process.env.DB_POOL_MAX || '10', 10),

  // Redis
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  redisPassword: process.env.REDIS_PASSWORD || '',

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'cloudswitch-dev-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'cloudswitch-refresh-secret-change-in-production',

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // Rate Limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),

  // Cache TTLs (seconds)
  cacheTtlDashboard: parseInt(process.env.CACHE_TTL_DASHBOARD || '60', 10),
  cacheTtlProjects: parseInt(process.env.CACHE_TTL_PROJECTS || '30', 10),

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',

  // App info
  appName: 'CloudSwitch',
  appVersion: process.env.npm_package_version || '1.0.0',
};

module.exports = config;
