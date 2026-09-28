const Service = require('../models/Service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { success, buildPagination } = require('../utils/apiResponse');
const { generateUniqueSlug } = require('../utils/generateSlug');
const cloudinaryService = require('../services/cloudinary.service');
const { localizeDocument } = require('../utils/localization');

/**
 * GET /api/services (public — active only)
 * Returns FLATTENED, localized content based on req.lang
 * (set by the language middleware from Accept-Language / ?lang=).
 */
exports.getPublicServices = catchAsync(async (req, res) => {
  const services = await Service.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
  const localized = localizeDocument(services, req.lang);
  return success(res, { message: 'Services retrieved successfully', data: { items: localized } });
});

/**
 * GET /api/services/:slug (public)
 * Resolves against EITHER language's slug field (so an English link
 * and an Arabic link for the same service both work), then returns
 * the response localized to req.lang regardless of which slug matched.
 */
exports.getPublicServiceBySlug = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const service = await Service.findOne({
    isActive: true,
    $or: [{ 'slug.en': slug }, { 'slug.ar': slug }],
  });
  if (!service) return next(new AppError('Service not found.', 404));
  const localized = localizeDocument(service, req.lang);
  return success(res, { message: 'Service retrieved successfully', data: { service: localized } });
});

/**
 * GET /api/admin/services
 * Admin always receives BOTH languages in full (never flattened) so
 * the CMS can edit en/ar independently.
 */
exports.getAdminServices = catchAsync(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const { search, status } = req.query;

  const filter = {};
  if (status === 'active') filter.isActive = true;
  if (status === 'inactive') filter.isActive = false;
  if (search) {
    filter.$text = { $search: search };
  }

  const [items, total] = await Promise.all([
    Service.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Service.countDocuments(filter),
  ]);

  return success(res, {
    message: 'Services retrieved successfully',
    data: { items, pagination: buildPagination({ page, limit, total }) },
  });
});

/**
 * GET /api/admin/services/:id
 */
exports.getAdminServiceById = catchAsync(async (req, res, next) => {
  const service = await Service.findById(req.params.id);
  if (!service) return next(new AppError('Service not found.', 404));
  return success(res, { message: 'Service retrieved successfully', data: { service } });
});

/**
 * POST /api/admin/services
 * Body carries bilingual objects, e.g. title: { en, ar }.
 * A separate slug is generated per language from that language's title.
 */
exports.createService = catchAsync(async (req, res) => {
  const { title, shortDescription, description, icon, order, isActive, seo } = req.body;

  const [slugEn, slugAr] = await Promise.all([
    generateUniqueSlug(Service, title.en, 'en'),
    generateUniqueSlug(Service, title.ar, 'ar'),
  ]);

  let image = { url: null, publicId: null };
  if (req.file) {
    image = await cloudinaryService.uploadImage(req.file.buffer, { folder: 'al-saiari-law/services' });
  }

  const service = await Service.create({
    title,
    slug: { en: slugEn, ar: slugAr },
    shortDescription,
    description,
    image,
    icon,
    order,
    isActive,
    seo,
  });

  return success(res, { message: 'Service created successfully', statusCode: 201, data: { service } });
});

/**
 * PUT /api/admin/services/:id
 * Each language's slug is only regenerated if that language's title changed.
 */
exports.updateService = catchAsync(async (req, res, next) => {
  const service = await Service.findById(req.params.id);
  if (!service) return next(new AppError('Service not found.', 404));

  const { title, shortDescription, description, icon, order, isActive, seo } = req.body;

  if (title) {
    if (title.en !== undefined && title.en !== service.title.en) {
      service.slug.en = await generateUniqueSlug(Service, title.en, 'en', service._id);
      service.title.en = title.en;
    }
    if (title.ar !== undefined && title.ar !== service.title.ar) {
      service.slug.ar = await generateUniqueSlug(Service, title.ar, 'ar', service._id);
      service.title.ar = title.ar;
    }
  }

  if (shortDescription) {
    if (shortDescription.en !== undefined) service.shortDescription.en = shortDescription.en;
    if (shortDescription.ar !== undefined) service.shortDescription.ar = shortDescription.ar;
  }
  if (description) {
    if (description.en !== undefined) service.description.en = description.en;
    if (description.ar !== undefined) service.description.ar = description.ar;
  }
  if (icon !== undefined) service.icon = icon;
  if (order !== undefined) service.order = order;
  if (isActive !== undefined) service.isActive = isActive;
  if (seo) {
    if (seo.metaTitle) {
      if (seo.metaTitle.en !== undefined) service.seo.metaTitle.en = seo.metaTitle.en;
      if (seo.metaTitle.ar !== undefined) service.seo.metaTitle.ar = seo.metaTitle.ar;
    }
    if (seo.metaDescription) {
      if (seo.metaDescription.en !== undefined) service.seo.metaDescription.en = seo.metaDescription.en;
      if (seo.metaDescription.ar !== undefined) service.seo.metaDescription.ar = seo.metaDescription.ar;
    }
  }

  if (req.file) {
    const newImage = await cloudinaryService.replaceImage(req.file.buffer, service.image?.publicId, {
      folder: 'al-saiari-law/services',
    });
    service.image = newImage;
  }

  await service.save();

  return success(res, { message: 'Service updated successfully', data: { service } });
});

/**
 * DELETE /api/admin/services/:id
 */
exports.deleteService = catchAsync(async (req, res, next) => {
  const service = await Service.findById(req.params.id);
  if (!service) return next(new AppError('Service not found.', 404));

  if (service.image?.publicId) {
    await cloudinaryService.deleteImage(service.image.publicId);
  }

  await service.deleteOne();

  return success(res, { message: 'Service deleted successfully' });
});

/**
 * PATCH /api/admin/services/:id/status
 */
exports.updateServiceStatus = catchAsync(async (req, res, next) => {
  const service = await Service.findByIdAndUpdate(
    req.params.id,
    { isActive: req.body.isActive },
    { new: true, runValidators: true },
  );
  if (!service) return next(new AppError('Service not found.', 404));
  return success(res, { message: 'Service status updated successfully', data: { service } });
});

/**
 * PATCH /api/admin/services/reorder
 * Body: { order: [{ id, order }, ...] }
 */
exports.reorderServices = catchAsync(async (req, res) => {
  const { order } = req.body;

  const bulkOps = order.map(({ id, order: newOrder }) => ({
    updateOne: { filter: { _id: id }, update: { $set: { order: newOrder } } },
  }));

  if (bulkOps.length > 0) {
    await Service.bulkWrite(bulkOps);
  }

  const services = await Service.find().sort({ order: 1 });

  return success(res, { message: 'Services reordered successfully', data: { items: services } });
});
