/**
 * Standardized API response helpers.
 * Success: { success: true, message, data }
 * Error:   { success: false, message, errors }
 */

function success(res, { message = 'Operation completed successfully', data = null, statusCode = 200 } = {}) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

function error(res, { message = 'Something went wrong', errors = [], statusCode = 500 } = {}) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}

function buildPagination({ page, limit, total }) {
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  return {
    page,
    limit,
    total,
    totalPages,
  };
}

module.exports = { success, error, buildPagination };
