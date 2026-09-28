const { validationResult } = require('express-validator');
const { error } = require('../utils/apiResponse');

/**
 * Runs after an array of express-validator checks. If any failed,
 * responds with a standardized 422 error; otherwise calls next().
 */
function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }

  const errors = result.array().map((e) => ({
    field: e.path,
    message: e.msg,
  }));

  return error(res, {
    message: 'Validation failed',
    errors,
    statusCode: 422,
  });
}

module.exports = validate;
