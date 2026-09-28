const express = require('express');
const serviceController = require('../controllers/service.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const validate = require('../middleware/validation.middleware');
const { uploadSingleImage } = require('../middleware/upload.middleware');
const {
  createServiceValidator,
  updateServiceValidator,
  idParamValidator,
  statusValidator,
  reorderValidator,
} = require('../validators/service.validator');

// Public router: mounted at /api/services
const publicRouter = express.Router();
publicRouter.get('/', serviceController.getPublicServices);
publicRouter.get('/:slug', serviceController.getPublicServiceBySlug);

// Admin router: mounted at /api/admin/services
const adminRouter = express.Router();
adminRouter.use(authenticate, authorize('admin'));

adminRouter.get('/', serviceController.getAdminServices);
adminRouter.post('/', uploadSingleImage('image'), createServiceValidator, validate, serviceController.createService);
// Reorder must be declared before /:id routes to avoid "reorder" being parsed as an id
adminRouter.patch('/reorder', reorderValidator, validate, serviceController.reorderServices);
adminRouter.get('/:id', idParamValidator, validate, serviceController.getAdminServiceById);
adminRouter.put('/:id', uploadSingleImage('image'), updateServiceValidator, validate, serviceController.updateService);
adminRouter.delete('/:id', idParamValidator, validate, serviceController.deleteService);
adminRouter.patch('/:id/status', statusValidator, validate, serviceController.updateServiceStatus);

module.exports = { publicRouter, adminRouter };
