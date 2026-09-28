const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { verifyToken } = require('../services/auth.service');
const User = require('../models/User');

/**
 * Verifies the JWT from the Authorization header, loads the user,
 * and attaches it to req.user. Rejects if the user no longer exists,
 * is deactivated, or changed their password after the token was issued.
 */
const authenticate = catchAsync(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Authentication required. Please log in.', 401));
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    return next(new AppError('Invalid or expired token. Please log in again.', 401));
  }

  const user = await User.findById(decoded.id).select('+passwordChangedAt');
  if (!user) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  if (!user.isActive) {
    return next(new AppError('This account has been deactivated.', 403));
  }

  if (user.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('Password was changed recently. Please log in again.', 401));
  }

  req.user = user;
  next();
});

/**
 * Role-based authorization. Usage: authorize('admin')
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    return next();
  };
}

module.exports = { authenticate, authorize };
