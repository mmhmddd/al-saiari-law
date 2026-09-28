const { body, param } = require('express-validator');

const createContactMessageValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email').normalizeEmail(),
  body('phone').optional().trim().isLength({ max: 30 }),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 3000 }),
];

const idParamValidator = [param('id').isMongoId().withMessage('Invalid message id')];

const statusValidator = [
  param('id').isMongoId().withMessage('Invalid message id'),
  body('status').isIn(['new', 'read', 'archived']).withMessage('Invalid status'),
];

module.exports = { createContactMessageValidator, idParamValidator, statusValidator };
