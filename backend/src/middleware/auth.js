/**
 * JWT Authentication middleware
 */
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { AuthenticationError, AuthorizationError } = require('../utils/errors');

/**
 * Verify JWT and attach user to request
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AuthenticationError('No token provided'));
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    next(err); // JWT errors are handled by error handler
  }
}

/**
 * Role-based authorization middleware factory
 * @param {...string} roles - Allowed roles
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AuthenticationError());
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return next(new AuthorizationError(`Role '${req.user.role}' is not allowed to perform this action`));
    }

    next();
  };
}

/**
 * Optional authentication — attaches user if token present, does not fail if missing
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
  } catch {
    // Token invalid — continue without user
  }

  next();
}

module.exports = { authenticate, authorize, optionalAuth };
