const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const activityController = require('../controllers/activity.controller');
const healthController = require('../controllers/health.controller');
const { authenticate } = require('../middleware/auth');

// Notifications
router.get('/notifications', authenticate, notificationController.getMyNotifications);
router.put('/notifications/:id/read', authenticate, notificationController.markRead);
router.put('/notifications/read-all', authenticate, notificationController.markAllRead);

// Activity
router.get('/activity', authenticate, activityController.getActivity);

// Health
router.get('/health', healthController.health);
router.get('/health/live', healthController.live);
router.get('/health/ready', healthController.ready);

module.exports = router;
