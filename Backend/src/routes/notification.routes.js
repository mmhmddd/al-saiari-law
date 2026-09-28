const express = require('express');
const notificationController = require('../controllers/notification.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const validate = require('../middleware/validation.middleware');
const { param } = require('express-validator');

const router = express.Router();

router.use(authenticate, authorize('admin'));

const idParamValidator = [param('id').isMongoId().withMessage('Invalid notification id')];

router.get('/', notificationController.getNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.patch('/read-all', notificationController.markAllAsRead);
router.patch('/:id/read', idParamValidator, validate, notificationController.markAsRead);
router.delete('/:id', idParamValidator, validate, notificationController.deleteNotification);

module.exports = router;
