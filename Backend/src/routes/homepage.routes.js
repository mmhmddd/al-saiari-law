const express = require('express');
const homepageController = require('../controllers/homepage.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { uploadSingleImage } = require('../middleware/upload.middleware');

// Public router: mounted at /api/homepage
const publicRouter = express.Router();
publicRouter.get('/', homepageController.getPublicHomepage);

// Admin router: mounted at /api/admin/homepage
const adminRouter = express.Router();
adminRouter.use(authenticate, authorize('admin'));

adminRouter.get('/', homepageController.getHomepage);
adminRouter.put('/', homepageController.updateHomepage);
adminRouter.put('/hero-image', uploadSingleImage('image'), homepageController.updateHeroImage);
adminRouter.put('/about-image', uploadSingleImage('image'), homepageController.updateAboutImage);

module.exports = { publicRouter, adminRouter };
