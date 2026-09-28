/**
 * Request validation middleware using express-validator
 */
const { validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errors');

/**
 * Run validation rules and throw on failure
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().map((e) => ({
      field: e.path || e.param,
      message: e.msg,
      value: e.value,
    }));
    return next(new ValidationError('Validation failed', details));
  }
  next();
}

module.exports = { validate };
