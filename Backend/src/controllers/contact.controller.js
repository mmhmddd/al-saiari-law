const ContactMessage = require('../models/ContactMessage');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { success, buildPagination } = require('../utils/apiResponse');
const { notifyNewContactMessage } = require('../services/notification.service');
const { sendContactMessageNotification } = require('../services/email.service');

/**
 * POST /api/contact (public)
 */
exports.createContactMessage = catchAsync(async (req, res) => {
  const { name, email, phone, message } = req.body;

  const contactMessage = await ContactMessage.create({ name, email, phone, message });

  notifyNewContactMessage(contactMessage).catch(() => {});
  sendContactMessageNotification(contactMessage).catch(() => {});

  return success(res, {
    message: 'Your message has been sent successfully. We will get back to you shortly.',
    statusCode: 201,
    data: { contactMessage },
  });
});

/**
 * GET /api/admin/contact
 * Supports: status, search, page, limit
 */
exports.getContactMessages = catchAsync(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const { status, search } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { message: { $regex: search, $options: 'i' } },
    ];
  }

  const [items, total] = await Promise.all([
    ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    ContactMessage.countDocuments(filter),
  ]);

  return success(res, {
    message: 'Contact messages retrieved successfully',
    data: { items, pagination: buildPagination({ page, limit, total }) },
  });
});

/**
 * GET /api/admin/contact/:id
 */
exports.getContactMessageById = catchAsync(async (req, res, next) => {
  const contactMessage = await ContactMessage.findById(req.params.id);
  if (!contactMessage) return next(new AppError('Contact message not found.', 404));
  return success(res, { message: 'Contact message retrieved successfully', data: { contactMessage } });
});

/**
 * PATCH /api/admin/contact/:id/status
 */
exports.updateContactMessageStatus = catchAsync(async (req, res, next) => {
  const contactMessage = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true },
  );
  if (!contactMessage) return next(new AppError('Contact message not found.', 404));
  return success(res, { message: 'Contact message status updated successfully', data: { contactMessage } });
});

/**
 * DELETE /api/admin/contact/:id
 */
exports.deleteContactMessage = catchAsync(async (req, res, next) => {
  const contactMessage = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!contactMessage) return next(new AppError('Contact message not found.', 404));
  return success(res, { message: 'Contact message deleted successfully' });
});
