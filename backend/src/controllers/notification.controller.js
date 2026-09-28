/**
 * Notification controller
 */
const notificationService = require('../services/notification.service');
const response = require('../utils/response');
const { NotFoundError } = require('../utils/errors');

async function getMyNotifications(req, res, next) {
  try {
    const unreadOnly = req.query.unreadOnly === 'true';
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const offset = (page - 1) * limit;

    const result = await notificationService.getForUser(req.user.id, { limit, offset, unreadOnly });
    response.success(res, result);
  } catch (err) {
    next(err);
  }
}

async function markRead(req, res, next) {
  try {
    const notification = await notificationService.markRead(req.params.id, req.user.id);
    if (!notification) throw new NotFoundError('Notification');
    response.success(res, notification, 'Notification marked as read');
  } catch (err) {
    next(err);
  }
}

async function markAllRead(req, res, next) {
  try {
    await notificationService.markAllRead(req.user.id);
    response.success(res, null, 'All notifications marked as read');
  } catch (err) {
    next(err);
  }
}

module.exports = { getMyNotifications, markRead, markAllRead };
