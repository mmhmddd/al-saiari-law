const express = require('express');
const articleController = require('../controllers/article.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const validate = require('../middleware/validation.middleware');
const { uploadSingleImage } = require('../middleware/upload.middleware');
const {
  createArticleValidator,
  updateArticleValidator,
  idParamValidator,
  statusValidator,
} = require('../validators/article.validator');

// Public router: mounted at /api/articles
const publicRouter = express.Router();
publicRouter.get('/', articleController.getPublicArticles);
publicRouter.get('/:slug', articleController.getPublicArticleBySlug);

// Admin router: mounted at /api/admin/articles
const adminRouter = express.Router();
adminRouter.use(authenticate, authorize('admin'));

adminRouter.get('/', articleController.getAdminArticles);
adminRouter.post('/', uploadSingleImage('featuredImage'), createArticleValidator, validate, articleController.createArticle);
adminRouter.post('/upload-content-image', uploadSingleImage('image'), articleController.uploadContentImage);
adminRouter.get('/:id', idParamValidator, validate, articleController.getAdminArticleById);
adminRouter.put('/:id', uploadSingleImage('featuredImage'), updateArticleValidator, validate, articleController.updateArticle);
adminRouter.delete('/:id', idParamValidator, validate, articleController.deleteArticle);
adminRouter.patch('/:id/status', statusValidator, validate, articleController.updateArticleStatus);

module.exports = { publicRouter, adminRouter };
