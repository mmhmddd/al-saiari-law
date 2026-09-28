const { body, param } = require('express-validator');

/**
 * Bilingual CMS content: title and shortDescription are required in
 * BOTH languages on create (per spec — major public CMS content must
 * be complete in en and ar). description/SEO are optional per language.
 * On update, fields are optional overall, but if a language sub-key is
 * provided it must be a string.
 */
const createServiceValidator = [
  body('title.en').trim().notEmpty().withMessage('English title is required').isLength({ max: 150 }),
  body('title.ar').trim().notEmpty().withMessage('Arabic title is required').isLength({ max: 150 }),
  body('shortDescription.en').trim().notEmpty().withMessage('English short description is required').isLength({ max: 300 }),
  body('shortDescription.ar').trim().notEmpty().withMessage('Arabic short description is required').isLength({ max: 300 }),
  body('description.en').optional().isString(),
  body('description.ar').optional().isString(),
  body('icon').optional().trim(),
  body('order').optional().isInt().withMessage('Order must be an integer'),
  body('isActive').optional().isBoolean(),
  body('seo.metaTitle.en').optional().trim().isLength({ max: 70 }),
  body('seo.metaTitle.ar').optional().trim().isLength({ max: 70 }),
  body('seo.metaDescription.en').optional().trim().isLength({ max: 160 }),
  body('seo.metaDescription.ar').optional().trim().isLength({ max: 160 }),
];

const updateServiceValidator = [
  param('id').isMongoId().withMessage('Invalid service id'),
  body('title.en').optional().trim().isLength({ min: 1, max: 150 }),
  body('title.ar').optional().trim().isLength({ min: 1, max: 150 }),
  body('shortDescription.en').optional().trim().isLength({ min: 1, max: 300 }),
  body('shortDescription.ar').optional().trim().isLength({ min: 1, max: 300 }),
  body('description.en').optional().isString(),
  body('description.ar').optional().isString(),
  body('icon').optional().trim(),
  body('order').optional().isInt(),
  body('isActive').optional().isBoolean(),
  body('seo.metaTitle.en').optional().trim().isLength({ max: 70 }),
  body('seo.metaTitle.ar').optional().trim().isLength({ max: 70 }),
  body('seo.metaDescription.en').optional().trim().isLength({ max: 160 }),
  body('seo.metaDescription.ar').optional().trim().isLength({ max: 160 }),
];

const idParamValidator = [param('id').isMongoId().withMessage('Invalid service id')];

const statusValidator = [
  param('id').isMongoId().withMessage('Invalid service id'),
  body('isActive').isBoolean().withMessage('isActive must be true or false'),
];

const reorderValidator = [
  body('order').isArray({ min: 1 }).withMessage('order must be a non-empty array'),
  body('order.*.id').isMongoId().withMessage('Each item requires a valid service id'),
  body('order.*.order').isInt().withMessage('Each item requires an integer order'),
];

module.exports = {
  createServiceValidator,
  updateServiceValidator,
  idParamValidator,
  statusValidator,
  reorderValidator,
};
