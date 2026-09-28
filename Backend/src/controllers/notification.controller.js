const Notification = require('../models/Notification');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { success, buildPagination } = require('../utils/apiResponse');
const { localizeDocument } = require('../utils/localization');

/**
 * Notifications are read-only, system-generated CMS copy — unlike
 * services/articles/homepage/settings, the admin never edits them.
 * So (per spec) they are localized for display based on req.lang
 * (the Angular admin dashboard's current language), rather than
 * returned as { en, ar } pairs for editing.
 */

/**
 * GET /api/admin/notifications
 */
exports.getNotifications = catchAsync(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
  const { isRead } = req.query;

  const filter = {};
  if (isRead === 'true') filter.isRead = true;
  if (isRead === 'false') filter.isRead = false;

  const [items, total] = await Promise.all([
    Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Notification.countDocuments(filter),
  ]);

  const localized = localizeDocument(items, req.lang);

  return success(res, {
    message: 'Notifications retrieved successfully',
    data: { items: localized, pagination: buildPagination({ page, limit, total }) },
  });
});

/**
 * GET /api/admin/notifications/unread-count
 */
exports.getUnreadCount = catchAsync(async (req, res) => {
  const count = await Notification.countDocuments({ isRead: false });
  return success(res, { message: 'Unread count retrieved successfully', data: { count } });
});

/**
 * PATCH /api/admin/notifications/:id/read
 */
exports.markAsRead = catchAsync(async (req, res, next) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true },
  );
  if (!notification) return next(new AppError('Notification not found.', 404));
  return success(res, {
    message: 'Notification marked as read',
    data: { notification: localizeDocument(notification, req.lang) },
  });
});

/**
 * PATCH /api/admin/notifications/read-all
 */
exports.markAllAsRead = catchAsync(async (req, res) => {
  await Notification.updateMany({ isRead: false }, { isRead: true });
  return success(res, { message: 'All notifications marked as read' });
});

/**
 * DELETE /api/admin/notifications/:id
 */
exports.deleteNotification = catchAsync(async (req, res, next) => {
  const notification = await Notification.findByIdAndDelete(req.params.id);
  if (!notification) return next(new AppError('Notification not found.', 404));
  return success(res, { message: 'Notification deleted successfully' });
});
