const express = require('express');
const consultationController = require('../controllers/consultation.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const validate = require('../middleware/validation.middleware');
const {
  createConsultationValidator,
  idParamValidator,
  statusValidator,
} = require('../validators/consultation.validator');

// Public router: mounted at /api/consultations
const publicRouter = express.Router();
publicRouter.post('/', createConsultationValidator, validate, consultationController.createConsultation);

// Admin router: mounted at /api/admin/consultations
const adminRouter = express.Router();
adminRouter.use(authenticate, authorize('admin'));

adminRouter.get('/', consultationController.getConsultations);
adminRouter.get('/:id', idParamValidator, validate, consultationController.getConsultationById);
adminRouter.patch('/:id/status', statusValidator, validate, consultationController.updateConsultationStatus);
adminRouter.delete('/:id', idParamValidator, validate, consultationController.deleteConsultation);

module.exports = { publicRouter, adminRouter };
