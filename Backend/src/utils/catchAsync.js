/**
 * Wraps an async controller/middleware so rejected promises are
 * forwarded to Express's error handling via next(), instead of
 * needing a try/catch block in every controller.
 */
module.exports = function catchAsync(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
