const Consultation = require('../models/Consultation');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { success, buildPagination } = require('../utils/apiResponse');
const { notifyNewConsultation } = require('../services/notification.service');
const { sendConsultationNotification } = require('../services/email.service');

/**
 * POST /api/consultations (public)
 *
 * `service` is now a reference to an actual Service document rather
 * than a free-text string, so the requested service is always
 * consistent with the CMS and can be displayed in whichever language
 * the Angular frontend is currently using (service.title.en /
 * service.title.ar), without any duplicated/inconsistent naming.
 *
 * Important architecture note: the consultation MUST be saved first
 * and the booking response returned as a success regardless of what
 * happens with the notification or email afterward. Neither of those
 * side effects may cause the booking itself to fail or disappear.
 */
exports.createConsultation = catchAsync(async (req, res) => {
  const { name, phone, service, preferredDate, preferredTime } = req.body;

  const consultation = await Consultation.create({ name, phone, service: service || null, preferredDate, preferredTime });

  // Populate the service's bilingual title so the notification/email
  // can reference it by name without a second round trip inside those
  // services. Populate failures (e.g. a stale/deleted service id)
  // must never block the booking response below.
  let populatedConsultation = consultation;
  try {
    populatedConsultation = await consultation.populate('service', 'title');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[Consultation] Failed to populate service reference:', err.message);
  }

  // Fire-and-forget: internal notification and admin email.
  // Both services already catch their own errors internally so a
  // failure here can never roll back or block the response below.
  notifyNewConsultation(populatedConsultation).catch(() => {});
  sendConsultationNotification(populatedConsultation).catch(() => {});

  return success(res, {
    message: 'Your consultation request has been received. We will contact you shortly.',
    statusCode: 201,
    data: { consultation },
  });
});

/**
 * GET /api/admin/consultations
 * Supports: status, service, date, page, limit
 * `service` populated with its bilingual title so the admin dashboard
 * can display it in whichever language the admin is using.
 */
exports.getConsultations = catchAsync(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const { status, service, date } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (service) filter.service = service;
  if (date) filter.preferredDate = date;

  const [items, total] = await Promise.all([
    Consultation.find(filter)
      .populate('service', 'title')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Consultation.countDocuments(filter),
  ]);

  return success(res, {
    message: 'Consultations retrieved successfully',
    data: { items, pagination: buildPagination({ page, limit, total }) },
  });
});

/**
 * GET /api/admin/consultations/:id
 */
exports.getConsultationById = catchAsync(async (req, res, next) => {
  const consultation = await Consultation.findById(req.params.id).populate('service', 'title');
  if (!consultation) return next(new AppError('Consultation not found.', 404));
  return success(res, { message: 'Consultation retrieved successfully', data: { consultation } });
});

/**
 * PATCH /api/admin/consultations/:id/status
 */
exports.updateConsultationStatus = catchAsync(async (req, res, next) => {
  const consultation = await Consultation.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true },
  ).populate('service', 'title');
  if (!consultation) return next(new AppError('Consultation not found.', 404));
  return success(res, { message: 'Consultation status updated successfully', data: { consultation } });
});

/**
 * DELETE /api/admin/consultations/:id
 */
exports.deleteConsultation = catchAsync(async (req, res, next) => {
  const consultation = await Consultation.findByIdAndDelete(req.params.id);
  if (!consultation) return next(new AppError('Consultation not found.', 404));
  return success(res, { message: 'Consultation deleted successfully' });
});
