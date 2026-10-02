const { body, param } = require('express-validator');

const createArticleValidator = [
  body('title.en').trim().notEmpty().withMessage('English title is required').isLength({ max: 200 }),
  body('title.ar').trim().notEmpty().withMessage('Arabic title is required').isLength({ max: 200 }),
  body('excerpt.en').optional().trim().isLength({ max: 400 }),
  body('excerpt.ar').optional().trim().isLength({ max: 400 }),
  body('content.en').optional().isString(),
  body('content.ar').optional().isString(),
  body('category.en').optional().trim(),
  body('category.ar').optional().trim(),
  body('tags.en').optional().isArray().withMessage('English tags must be an array'),
  body('tags.en.*').optional().isString().trim(),
  body('tags.ar').optional().isArray().withMessage('Arabic tags must be an array'),
  body('tags.ar.*').optional().isString().trim(),
  body('imageAlt.en').optional().trim().isLength({ max: 200 }),
  body('imageAlt.ar').optional().trim().isLength({ max: 200 }),
  body('status').optional().isIn(['draft', 'published', 'scheduled', 'archived']),
  body('seo.metaTitle.en').optional().trim().isLength({ max: 70 }),
  body('seo.metaTitle.ar').optional().trim().isLength({ max: 70 }),
  body('seo.metaDescription.en').optional().trim().isLength({ max: 160 }),
  body('seo.metaDescription.ar').optional().trim().isLength({ max: 160 }),
  body('seo.keywords.en').optional().isArray(),
  body('seo.keywords.ar').optional().isArray(),
  body('seo.canonicalUrl.en').optional().trim().isURL().withMessage('English canonical URL must be valid'),
  body('seo.canonicalUrl.ar').optional().trim().isURL().withMessage('Arabic canonical URL must be valid'),
];

const updateArticleValidator = [
  param('id').isMongoId().withMessage('Invalid article id'),
  body('title.en').optional().trim().isLength({ min: 1, max: 200 }),
  body('title.ar').optional().trim().isLength({ min: 1, max: 200 }),
  body('excerpt.en').optional().trim().isLength({ max: 400 }),
  body('excerpt.ar').optional().trim().isLength({ max: 400 }),
  body('content.en').optional().isString(),
  body('content.ar').optional().isString(),
  body('category.en').optional().trim(),
  body('category.ar').optional().trim(),
  body('tags.en').optional().isArray(),
  body('tags.en.*').optional().isString().trim(),
  body('tags.ar').optional().isArray(),
  body('tags.ar.*').optional().isString().trim(),
  body('imageAlt.en').optional().trim().isLength({ max: 200 }),
  body('imageAlt.ar').optional().trim().isLength({ max: 200 }),
  body('status').optional().isIn(['draft', 'published', 'scheduled', 'archived']),
  body('seo.metaTitle.en').optional().trim().isLength({ max: 70 }),
  body('seo.metaTitle.ar').optional().trim().isLength({ max: 70 }),
  body('seo.metaDescription.en').optional().trim().isLength({ max: 160 }),
  body('seo.metaDescription.ar').optional().trim().isLength({ max: 160 }),
  body('seo.keywords.en').optional().isArray(),
  body('seo.keywords.ar').optional().isArray(),
  body('seo.canonicalUrl.en').optional().trim().isURL().withMessage('English canonical URL must be valid'),
  body('seo.canonicalUrl.ar').optional().trim().isURL().withMessage('Arabic canonical URL must be valid'),
];

const idParamValidator = [param('id').isMongoId().withMessage('Invalid article id')];

const statusValidator = [
  param('id').isMongoId().withMessage('Invalid article id'),
  body('status').isIn(['draft', 'published', 'scheduled', 'archived']).withMessage('Invalid status'),
];

module.exports = {
  createArticleValidator,
  updateArticleValidator,
  idParamValidator,
  statusValidator,
};
