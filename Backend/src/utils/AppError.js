/**
 * Operational error class. Throw this from controllers/services when
 * you know exactly what went wrong and what HTTP status/message to send.
 * Anything else (programming errors, unexpected exceptions) is treated
 * as a 500 by the central error handler.
 */
class AppError extends Error {
  constructor(message, statusCode = 500, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
