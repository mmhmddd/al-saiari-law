const express = require('express');
const settingsController = require('../controllers/settings.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { uploadSingleImage } = require('../middleware/upload.middleware');

// Public router: mounted at /api/settings
const publicRouter = express.Router();
publicRouter.get('/', settingsController.getPublicSettings);

// Admin router: mounted at /api/admin/settings
const adminRouter = express.Router();
adminRouter.use(authenticate, authorize('admin'));

adminRouter.get('/', settingsController.getSettings);
adminRouter.put('/', uploadSingleImage('logo'), settingsController.updateSettings);

module.exports = { publicRouter, adminRouter };
