/**
 * Health controller
 * Endpoints designed to be wired to Kubernetes liveness/readiness probes later.
 */
const db = require('../db/pool');
const redis = require('../services/redis');
const config = require('../config/env');

const startTime = Date.now();

/**
 * GET /api/v1/health
 * Full health check with component statuses
 */
async function health(req, res) {
  const [dbOk, redisOk] = await Promise.all([
    db.testConnection(),
    redis.testConnection(),
  ]);

  const uptime = Math.floor((Date.now() - startTime) / 1000);

  const status = {
    status: dbOk ? 'operational' : 'degraded',
    version: config.appVersion,
    environment: config.nodeEnv,
    uptime,
    timestamp: new Date().toISOString(),
    components: {
      api: { status: 'operational', message: 'API is running' },
      database: {
        status: dbOk ? 'operational' : 'unavailable',
        message: dbOk ? 'Database connected' : 'Database connection failed',
      },
      redis: {
        status: redisOk ? 'operational' : 'unavailable',
        message: redisOk ? 'Redis connected' : 'Redis connection failed (non-critical)',
      },
      authentication: { status: 'operational', message: 'JWT auth active' },
    },
  };

  const httpStatus = dbOk ? 200 : 503;
  res.status(httpStatus).json({ success: true, data: status });
}

/**
 * GET /api/v1/health/live
 * Kubernetes liveness probe — just checks the process is alive
 */
function live(req, res) {
  res.status(200).json({
    success: true,
    data: { status: 'alive', timestamp: new Date().toISOString() },
  });
}

/**
 * GET /api/v1/health/ready
 * Kubernetes readiness probe — checks DB connection before accepting traffic
 */
async function ready(req, res) {
  const dbOk = await db.testConnection();

  if (!dbOk) {
    return res.status(503).json({
      success: false,
      data: { status: 'not_ready', reason: 'Database unavailable' },
    });
  }

  res.status(200).json({
    success: true,
    data: { status: 'ready', timestamp: new Date().toISOString() },
  });
}

module.exports = { health, live, ready };
