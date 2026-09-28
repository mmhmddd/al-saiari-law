const crypto = require('crypto');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { success } = require('../utils/apiResponse');
const { signToken } = require('../services/auth.service');
const { sendPasswordResetEmail } = require('../services/email.service');
const env = require('../config/environment');

/**
 * POST /api/auth/register
 * Public users can only ever register with role "user" — the role
 * field is deliberately never read from req.body here.
 */
exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return next(new AppError('An account with this email already exists.', 409));
  }

  const user = await User.create({ name, email, password, role: 'user' });

  const token = signToken(user);

  return success(res, {
    message: 'Registration successful',
    statusCode: 201,
    data: { token, user: user.toSafeObject() },
  });
});

/**
 * POST /api/auth/login
 */
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new AppError('Invalid email or password.', 401));
  }

  if (!user.isActive) {
    return next(new AppError('This account has been deactivated. Please contact the administrator.', 403));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new AppError('Invalid email or password.', 401));
  }

  const token = signToken(user);

  return success(res, {
    message: 'Login successful',
    data: { token, user: user.toSafeObject() },
  });
});

/**
 * POST /api/auth/logout
 * Stateless JWT — logout is handled client-side by discarding the token.
 * Endpoint exists for API completeness / future token-blacklisting.
 */
exports.logout = catchAsync(async (req, res) => {
  return success(res, { message: 'Logged out successfully' });
});

/**
 * GET /api/auth/me
 */
exports.getMe = catchAsync(async (req, res) => {
  return success(res, {
    message: 'Current user retrieved',
    data: { user: req.user.toSafeObject() },
  });
});

/**
 * PUT /api/auth/profile
 */
exports.updateProfile = catchAsync(async (req, res, next) => {
  const { name, email } = req.body;

  if (email) {
    const existing = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (existing) {
      return next(new AppError('This email is already in use.', 409));
    }
  }

  const updates = {};
  if (name !== undefined) updates.name = name;
  if (email !== undefined) updates.email = email;

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  return success(res, {
    message: 'Profile updated successfully',
    data: { user: user.toSafeObject() },
  });
});

/**
 * PUT /api/auth/change-password
 */
exports.changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return next(new AppError('Current password is incorrect.', 401));
  }

  user.password = newPassword;
  await user.save();

  const token = signToken(user);

  return success(res, {
    message: 'Password changed successfully',
    data: { token },
  });
});

/**
 * POST /api/auth/forgot-password
 * Always returns a generic success message, regardless of whether
 * the email exists, to avoid leaking account existence.
 */
exports.forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const genericMessage = 'If an account exists with this email, a password reset link has been sent.';

  const user = await User.findOne({ email });
  if (!user || !user.isActive) {
    return success(res, { message: genericMessage });
  }

  const rawToken = user.createPasswordResetToken(env.resetTokenExpiresMinutes);
  await user.save({ validateBeforeSave: false });

  try {
    await sendPasswordResetEmail(user, rawToken);
  } catch (err) {
    // Do not fail the request over an email delivery issue, but do
    // roll back the token so a broken email pipeline can't leave a
    // dangling, unusable reset request.
    user.clearPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    // eslint-disable-next-line no-console
    console.error('[Auth] Failed to send password reset email:', err.message);
  }

  return success(res, { message: genericMessage });
});

/**
 * POST /api/auth/reset-password/:token
 */
exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetTokenHash: tokenHash,
    passwordResetExpires: { $gt: new Date() },
  }).select('+passwordResetTokenHash +passwordResetExpires');

  if (!user) {
    return next(new AppError('Password reset token is invalid or has expired.', 400));
  }

  user.password = password;
  user.clearPasswordResetToken();
  await user.save();

  return success(res, { message: 'Password has been reset successfully. You can now log in.' });
});
