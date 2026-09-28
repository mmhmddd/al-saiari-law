const env = require('../config/environment');
const AppError = require('../utils/AppError');

/**
 * 404 handler for unmatched routes — placed after all routes in app.js.
 */
function notFound(req, res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}

function handleCastError(err) {
  return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
}

function handleDuplicateFieldError(err) {
  const field = Object.keys(err.keyValue || {})[0] || 'field';
  const value = err.keyValue ? err.keyValue[field] : '';
  return new AppError(`Duplicate value for ${field}: "${value}". Please use another value.`, 409);
}

function handleValidationError(err) {
  const errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
  return new AppError('Validation failed', 400, errors);
}

function handleJwtError() {
  return new AppError('Invalid token. Please log in again.', 401);
}

function handleJwtExpiredError() {
  return new AppError('Your session has expired. Please log in again.', 401);
}

/**
 * Central error handler. Must be the LAST middleware registered.
 * Never leaks stack traces or internal details in production.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let handled = err;

  if (!(err instanceof AppError)) {
    if (err.name === 'CastError') handled = handleCastError(err);
    else if (err.code === 11000) handled = handleDuplicateFieldError(err);
    else if (err.name === 'ValidationError') handled = handleValidationError(err);
    else if (err.name === 'JsonWebTokenError') handled = handleJwtError();
    else if (err.name === 'TokenExpiredError') handled = handleJwtExpiredError();
    else {
      handled = new AppError(
        env.isProduction ? 'Something went wrong. Please try again later.' : err.message,
        err.statusCode || 500,
      );
    }
  }

  const statusCode = handled.statusCode || 500;

  if (!env.isProduction && statusCode >= 500) {
    // eslint-disable-next-line no-console
    console.error('[Error]', err);
  }

  res.status(statusCode).json({
    success: false,
    message: handled.message || 'Something went wrong',
    errors: handled.errors && handled.errors.length ? handled.errors : [],
    ...(!env.isProduction && statusCode >= 500 ? { stack: err.stack } : {}),
  });
}

module.exports = { notFound, errorHandler };
