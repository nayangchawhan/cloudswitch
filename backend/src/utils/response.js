/**
 * Standardized API response helpers
 * Ensures all API responses follow the same structure.
 */

/**
 * Send a success response
 * @param {object} res - Express response object
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code
 */
function success(res, data = null, message = 'Success', statusCode = 200) {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
}

/**
 * Send a created response (201)
 */
function created(res, data = null, message = 'Created successfully') {
  return success(res, data, message, 201);
}

/**
 * Send an error response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @param {string} code - Error code constant
 * @param {number} statusCode - HTTP status code
 * @param {object} details - Additional error details
 */
function error(res, message = 'An error occurred', code = 'INTERNAL_ERROR', statusCode = 500, details = null) {
  const response = {
    success: false,
    message,
    error: { code },
  };

  if (details) {
    response.error.details = details;
  }

  return res.status(statusCode).json(response);
}

/**
 * Paginated response
 */
function paginated(res, data, pagination, message = 'Success') {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination,
  });
}

module.exports = { success, created, error, paginated };
