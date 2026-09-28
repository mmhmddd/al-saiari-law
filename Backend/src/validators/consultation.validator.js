const { body, param } = require('express-validator');

const createConsultationValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone is required')
    .isLength({ max: 30 })
    .matches(/^[0-9+\-\s()]{6,30}$/)
    .withMessage('Phone number format is invalid'),
  body('service').optional({ nullable: true }).isMongoId().withMessage('Service must be a valid service id'),
  body('preferredDate').optional().trim(),
  body('preferredTime').optional().trim(),
];

const idParamValidator = [param('id').isMongoId().withMessage('Invalid consultation id')];

const statusValidator = [
  param('id').isMongoId().withMessage('Invalid consultation id'),
  body('status').isIn(['new', 'contacted', 'completed', 'cancelled']).withMessage('Invalid status'),
];

module.exports = { createConsultationValidator, idParamValidator, statusValidator };
