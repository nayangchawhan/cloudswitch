/**
 * PostgreSQL database connection pool
 * Uses pg's built-in pooling — stateless and cloud-agnostic.
 */
const { Pool } = require('pg');
const config = require('../config/env');
const logger = require('../utils/logger');

let pool = null;

/**
 * Initialize the database connection pool
 */
function createPool() {
  const newPool = new Pool({
    connectionString: config.databaseUrl,
    min: config.dbPoolMin,
    max: config.dbPoolMax,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  newPool.on('error', (err) => {
    logger.error('Unexpected PostgreSQL pool error', { error: err.message });
  });

  newPool.on('connect', () => {
    logger.debug('New database connection established');
  });

  return newPool;
}

/**
 * Get the database pool (singleton)
 */
function getPool() {
  if (!pool) {
    pool = createPool();
  }
  return pool;
}

/**
 * Execute a query against the database
 * @param {string} text - SQL query
 * @param {Array} params - Query parameters
 */
async function query(text, params = []) {
  const start = Date.now();
  const db = getPool();

  try {
    const result = await db.query(text, params);
    const duration = Date.now() - start;
    logger.debug('Query executed', { query: text.substring(0, 100), duration, rows: result.rowCount });
    return result;
  } catch (error) {
    logger.error('Database query error', { query: text.substring(0, 100), error: error.message });
    throw error;
  }
}

/**
 * Get a client from the pool for transaction use
 */
async function getClient() {
  const db = getPool();
  return db.connect();
}

/**
 * Test the database connection
 */
async function testConnection() {
  try {
    const result = await query('SELECT NOW() as now, version() as version');
    logger.info('Database connected', { timestamp: result.rows[0].now });
    return true;
  } catch (error) {
    logger.error('Database connection failed', { error: error.message });
    return false;
  }
}

/**
 * Close the pool (for graceful shutdown)
 */
async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
    logger.info('Database pool closed');
  }
}

module.exports = {
  query,
  getClient,
  getPool,
  testConnection,
  closePool,
};
