/**
 * Global error handler middleware
 * Must be registered LAST in Express middleware chain.
 */
const logger = require('../utils/logger');
const { AppError } = require('../utils/errors');

function errorHandler(err, req, res, next) {
  // Log all errors
  if (err.statusCode >= 500 || !err.statusCode) {
    logger.error('Unhandled error', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
    });
  } else {
    logger.warn('Request error', {
      message: err.message,
      code: err.code,
      url: req.originalUrl,
      method: req.method,
    });
  }

  // Known application errors
  if (err instanceof AppError) {
    const response = {
      success: false,
      message: err.message,
      error: { code: err.code },
    };
    if (err.details) {
      response.error.details = err.details;
    }
    return res.status(err.statusCode).json(response);
  }

  // Express-validator errors
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON in request body',
      error: { code: 'INVALID_JSON' },
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: { code: 'INVALID_TOKEN' },
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
      error: { code: 'TOKEN_EXPIRED' },
    });
  }

  // PostgreSQL errors
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'A record with this data already exists',
      error: { code: 'DUPLICATE_ENTRY' },
    });
  }

  if (err.code === '23503') {
    return res.status(400).json({
      success: false,
      message: 'Referenced record does not exist',
      error: { code: 'FOREIGN_KEY_VIOLATION' },
    });
  }

  // Generic fallback
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    error: { code: 'INTERNAL_ERROR' },
  });
}

module.exports = errorHandler;
