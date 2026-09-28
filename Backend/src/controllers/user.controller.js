const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { success, buildPagination } = require('../utils/apiResponse');

/**
 * GET /api/admin/users
 * Supports: search, role, status, page, limit
 */
exports.getUsers = catchAsync(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const { search, role, status } = req.query;

  const filter = {};
  if (role) filter.role = role;
  if (status === 'active') filter.isActive = true;
  if (status === 'inactive') filter.isActive = false;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const [items, total] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  return success(res, {
    message: 'Users retrieved successfully',
    data: {
      items: items.map((u) => u.toSafeObject()),
      pagination: buildPagination({ page, limit, total }),
    },
  });
});

/**
 * GET /api/admin/users/:id
 */
exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('User not found.', 404));
  return success(res, { message: 'User retrieved successfully', data: { user: user.toSafeObject() } });
});

/**
 * POST /api/admin/users
 * Admins can create users of any role, including other admins.
 */
exports.createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role, isActive } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return next(new AppError('An account with this email already exists.', 409));
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user',
    isActive: isActive !== undefined ? isActive : true,
  });

  return success(res, {
    message: 'User created successfully',
    statusCode: 201,
    data: { user: user.toSafeObject() },
  });
});

/**
 * PUT /api/admin/users/:id
 */
exports.updateUser = catchAsync(async (req, res, next) => {
  const { name, email, role, isActive } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('User not found.', 404));

  if (email && email !== user.email) {
    const existing = await User.findOne({ email, _id: { $ne: user._id } });
    if (existing) return next(new AppError('This email is already in use.', 409));
    user.email = email;
  }

  if (name !== undefined) user.name = name;

  // Guard: prevent removing the last active admin via role change or deactivation
  if ((role === 'user' || isActive === false) && user.role === 'admin') {
    await guardLastActiveAdmin(user._id);
  }

  if (role !== undefined) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;

  await user.save();

  return success(res, { message: 'User updated successfully', data: { user: user.toSafeObject() } });
});

/**
 * DELETE /api/admin/users/:id
 */
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('User not found.', 404));

  if (user.role === 'admin') {
    await guardLastActiveAdmin(user._id);
  }

  if (req.user._id.equals(user._id)) {
    return next(new AppError('You cannot delete your own account.', 400));
  }

  await user.deleteOne();

  return success(res, { message: 'User deleted successfully' });
});

/**
 * PATCH /api/admin/users/:id/status
 */
exports.updateUserStatus = catchAsync(async (req, res, next) => {
  const { isActive } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('User not found.', 404));

  if (isActive === false && user.role === 'admin') {
    await guardLastActiveAdmin(user._id);
  }

  user.isActive = isActive;
  await user.save();

  return success(res, { message: 'User status updated successfully', data: { user: user.toSafeObject() } });
});

/**
 * PATCH /api/admin/users/:id/role
 */
exports.updateUserRole = catchAsync(async (req, res, next) => {
  const { role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('User not found.', 404));

  if (role === 'user' && user.role === 'admin') {
    await guardLastActiveAdmin(user._id);
  }

  user.role = role;
  await user.save();

  return success(res, { message: 'User role updated successfully', data: { user: user.toSafeObject() } });
});

/**
 * Throws if demoting/deactivating/deleting `excludeUserId` would leave
 * zero active admins in the system.
 */
async function guardLastActiveAdmin(excludeUserId) {
  const otherActiveAdmins = await User.countDocuments({
    role: 'admin',
    isActive: true,
    _id: { $ne: excludeUserId },
  });

  if (otherActiveAdmins === 0) {
    throw new AppError('Cannot remove the last active admin account.', 400);
  }
}
