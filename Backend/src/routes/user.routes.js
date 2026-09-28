const express = require('express');
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const validate = require('../middleware/validation.middleware');
const {
  createUserValidator,
  updateUserValidator,
  idParamValidator,
  statusValidator,
  roleValidator,
} = require('../validators/user.validator');

const router = express.Router();

// All routes below are admin-only
router.use(authenticate, authorize('admin'));

router.get('/', userController.getUsers);
router.post('/', createUserValidator, validate, userController.createUser);
router.get('/:id', idParamValidator, validate, userController.getUserById);
router.put('/:id', updateUserValidator, validate, userController.updateUser);
router.delete('/:id', idParamValidator, validate, userController.deleteUser);
router.patch('/:id/status', statusValidator, validate, userController.updateUserStatus);
router.patch('/:id/role', roleValidator, validate, userController.updateUserRole);

module.exports = router;
