const { body, param } = require('express-validator');

const createUserValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email').normalizeEmail(),
  body('password')
    .isString()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),
  body('role').optional().isIn(['admin', 'user']).withMessage('Role must be admin or user'),
  body('isActive').optional().isBoolean(),
];

const updateUserValidator = [
  param('id').isMongoId().withMessage('Invalid user id'),
  body('name').optional().trim().isLength({ min: 1, max: 100 }),
  body('email').optional().trim().isEmail().withMessage('Invalid email').normalizeEmail(),
  body('role').optional().isIn(['admin', 'user']).withMessage('Role must be admin or user'),
  body('isActive').optional().isBoolean(),
];

const idParamValidator = [param('id').isMongoId().withMessage('Invalid user id')];

const statusValidator = [
  param('id').isMongoId().withMessage('Invalid user id'),
  body('isActive').isBoolean().withMessage('isActive must be true or false'),
];

const roleValidator = [
  param('id').isMongoId().withMessage('Invalid user id'),
  body('role').isIn(['admin', 'user']).withMessage('Role must be admin or user'),
];

module.exports = {
  createUserValidator,
  updateUserValidator,
  idParamValidator,
  statusValidator,
  roleValidator,
};
