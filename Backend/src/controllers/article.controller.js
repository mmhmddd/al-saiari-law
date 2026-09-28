const Article = require('../models/Article');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { success, buildPagination } = require('../utils/apiResponse');
const { generateUniqueSlug } = require('../utils/generateSlug');
const { sanitizeArticleHtml } = require('../utils/sanitizeHtml');
const cloudinaryService = require('../services/cloudinary.service');
const { localizeDocument } = require('../utils/localization');

/**
 * GET /api/articles (public — published only)
 * Returns flattened, localized content. `category` filter matches
 * against either language's stored value since the query string
 * itself has no language context of its own.
 */
exports.getPublicArticles = catchAsync(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const { category, search } = req.query;

  const filter = { status: 'published' };
  if (category) {
    filter.$or = [{ 'category.en': category }, { 'category.ar': category }];
  }
  if (search) filter.$text = { $search: search };

  const [items, total] = await Promise.all([
    Article.find(filter)
      .populate('author', 'name')
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Article.countDocuments(filter),
  ]);

  const localized = localizeDocument(items, req.lang);

  return success(res, {
    message: 'Articles retrieved successfully',
    data: { items: localized, pagination: buildPagination({ page, limit, total }) },
  });
});

/**
 * GET /api/articles/:slug (public)
 * Resolves against either language's slug field, then localizes the
 * response to req.lang regardless of which slug matched.
 */
exports.getPublicArticleBySlug = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const article = await Article.findOne({
    status: 'published',
    $or: [{ 'slug.en': slug }, { 'slug.ar': slug }],
  }).populate('author', 'name');
  if (!article) return next(new AppError('Article not found.', 404));
  const localized = localizeDocument(article, req.lang);
  return success(res, { message: 'Article retrieved successfully', data: { article: localized } });
});

/**
 * GET /api/admin/articles
 * Admin always receives both languages in full.
 */
exports.getAdminArticles = catchAsync(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const { search, status, category } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (category) {
    filter.$or = [{ 'category.en': category }, { 'category.ar': category }];
  }
  if (search) filter.$text = { $search: search };

  const [items, total] = await Promise.all([
    Article.find(filter)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Article.countDocuments(filter),
  ]);

  return success(res, {
    message: 'Articles retrieved successfully',
    data: { items, pagination: buildPagination({ page, limit, total }) },
  });
});

/**
 * GET /api/admin/articles/:id
 */
exports.getAdminArticleById = catchAsync(async (req, res, next) => {
  const article = await Article.findById(req.params.id).populate('author', 'name email');
  if (!article) return next(new AppError('Article not found.', 404));
  return success(res, { message: 'Article retrieved successfully', data: { article } });
});

/**
 * POST /api/admin/articles
 * Body carries bilingual objects for title/excerpt/content/category/
 * tags/seo. Both language versions of `content` are sanitized
 * independently — never only one.
 */
exports.createArticle = catchAsync(async (req, res) => {
  const { title, excerpt, content, category, tags, status, seo } = req.body;

  const [slugEn, slugAr] = await Promise.all([
    generateUniqueSlug(Article, title.en, 'en'),
    generateUniqueSlug(Article, title.ar, 'ar'),
  ]);

  let featuredImage = { url: null, publicId: null };
  if (req.file) {
    featuredImage = await cloudinaryService.uploadImage(req.file.buffer, { folder: 'al-saiari-law/articles' });
  }

  const finalStatus = status || 'draft';

  const sanitizedContent = {
    en: sanitizeArticleHtml((content && content.en) || ''),
    ar: sanitizeArticleHtml((content && content.ar) || ''),
  };

  const article = await Article.create({
    title,
    slug: { en: slugEn, ar: slugAr },
    excerpt,
    content: sanitizedContent,
    featuredImage,
    author: req.user._id,
    category,
    tags,
    status: finalStatus,
    publishedAt: finalStatus === 'published' ? new Date() : null,
    seo,
  });

  return success(res, { message: 'Article created successfully', statusCode: 201, data: { article } });
});

/**
 * PUT /api/admin/articles/:id
 */
exports.updateArticle = catchAsync(async (req, res, next) => {
  const article = await Article.findById(req.params.id);
  if (!article) return next(new AppError('Article not found.', 404));

  const { title, excerpt, content, category, tags, status, seo } = req.body;

  if (title) {
    if (title.en !== undefined && title.en !== article.title.en) {
      article.slug.en = await generateUniqueSlug(Article, title.en, 'en', article._id);
      article.title.en = title.en;
    }
    if (title.ar !== undefined && title.ar !== article.title.ar) {
      article.slug.ar = await generateUniqueSlug(Article, title.ar, 'ar', article._id);
      article.title.ar = title.ar;
    }
  }

  if (excerpt) {
    if (excerpt.en !== undefined) article.excerpt.en = excerpt.en;
    if (excerpt.ar !== undefined) article.excerpt.ar = excerpt.ar;
  }

  if (content) {
    // Sanitize independently — updating one language never skips
    // sanitization of, or silently touches, the other.
    if (content.en !== undefined) article.content.en = sanitizeArticleHtml(content.en);
    if (content.ar !== undefined) article.content.ar = sanitizeArticleHtml(content.ar);
  }

  if (category) {
    if (category.en !== undefined) article.category.en = category.en;
    if (category.ar !== undefined) article.category.ar = category.ar;
  }

  if (tags) {
    if (tags.en !== undefined) article.tags.en = tags.en;
    if (tags.ar !== undefined) article.tags.ar = tags.ar;
  }

  if (seo) {
    if (seo.metaTitle) {
      if (seo.metaTitle.en !== undefined) article.seo.metaTitle.en = seo.metaTitle.en;
      if (seo.metaTitle.ar !== undefined) article.seo.metaTitle.ar = seo.metaTitle.ar;
    }
    if (seo.metaDescription) {
      if (seo.metaDescription.en !== undefined) article.seo.metaDescription.en = seo.metaDescription.en;
      if (seo.metaDescription.ar !== undefined) article.seo.metaDescription.ar = seo.metaDescription.ar;
    }
    if (seo.keywords) {
      if (seo.keywords.en !== undefined) article.seo.keywords.en = seo.keywords.en;
      if (seo.keywords.ar !== undefined) article.seo.keywords.ar = seo.keywords.ar;
    }
    if (seo.canonicalUrl) {
      if (seo.canonicalUrl.en !== undefined) article.seo.canonicalUrl.en = seo.canonicalUrl.en;
      if (seo.canonicalUrl.ar !== undefined) article.seo.canonicalUrl.ar = seo.canonicalUrl.ar;
    }
  }

  if (status !== undefined && status !== article.status) {
    article.status = status;
    if (status === 'published' && !article.publishedAt) {
      article.publishedAt = new Date();
    }
  }

  if (req.file) {
    const newImage = await cloudinaryService.replaceImage(req.file.buffer, article.featuredImage?.publicId, {
      folder: 'al-saiari-law/articles',
    });
    article.featuredImage = newImage;
  }

  await article.save();

  return success(res, { message: 'Article updated successfully', data: { article } });
});

/**
 * DELETE /api/admin/articles/:id
 */
exports.deleteArticle = catchAsync(async (req, res, next) => {
  const article = await Article.findById(req.params.id);
  if (!article) return next(new AppError('Article not found.', 404));

  if (article.featuredImage?.publicId) {
    await cloudinaryService.deleteImage(article.featuredImage.publicId);
  }

  await article.deleteOne();

  return success(res, { message: 'Article deleted successfully' });
});

/**
 * PATCH /api/admin/articles/:id/status
 * Used to publish/unpublish/draft/archive an article.
 */
exports.updateArticleStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const article = await Article.findById(req.params.id);
  if (!article) return next(new AppError('Article not found.', 404));

  article.status = status;
  if (status === 'published' && !article.publishedAt) {
    article.publishedAt = new Date();
  }

  await article.save();

  return success(res, { message: 'Article status updated successfully', data: { article } });
});

/**
 * POST /api/admin/articles/upload-content-image
 * Uploads an image to be embedded inside the rich-text article body
 * (as opposed to the featured image). Returns the Cloudinary URL for
 * the Angular editor to insert an <img> tag with, in whichever
 * language's editor pane the admin is currently working in.
 */
exports.uploadContentImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('No image file provided.', 400));

  const uploaded = await cloudinaryService.uploadImage(req.file.buffer, {
    folder: 'al-saiari-law/articles/content',
  });

  return success(res, {
    message: 'Image uploaded successfully',
    statusCode: 201,
    data: uploaded,
  });
});
