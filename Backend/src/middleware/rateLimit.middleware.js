const rateLimit = require('express-rate-limit');
const env = require('../config/environment');

/**
 * General API rate limiter — applied globally in app.js.
 */
const generalLimiter = rateLimit({
  windowMs: env.rateLimit.windowMinutes * 60 * 1000,
  max: env.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
    errors: [],
  },
});

/**
 * Stricter limiter for sensitive auth endpoints (login, forgot-password)
 * to slow down brute-force / enumeration attempts.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many attempts. Please try again later.',
    errors: [],
  },
});

module.exports = { generalLimiter, authLimiter };
