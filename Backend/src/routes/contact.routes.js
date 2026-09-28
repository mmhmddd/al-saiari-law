const express = require('express');
const contactController = require('../controllers/contact.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const validate = require('../middleware/validation.middleware');
const {
  createContactMessageValidator,
  idParamValidator,
  statusValidator,
} = require('../validators/contact.validator');

// Public router: mounted at /api/contact
const publicRouter = express.Router();
publicRouter.post('/', createContactMessageValidator, validate, contactController.createContactMessage);

// Admin router: mounted at /api/admin/contact
const adminRouter = express.Router();
adminRouter.use(authenticate, authorize('admin'));

adminRouter.get('/', contactController.getContactMessages);
adminRouter.get('/:id', idParamValidator, validate, contactController.getContactMessageById);
adminRouter.patch('/:id/status', statusValidator, validate, contactController.updateContactMessageStatus);
adminRouter.delete('/:id', idParamValidator, validate, contactController.deleteContactMessage);

module.exports = { publicRouter, adminRouter };
