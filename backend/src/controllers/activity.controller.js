/**
 * Activity controller
 */
const activityService = require('../services/activity.service');
const response = require('../utils/response');

async function getActivity(req, res, next) {
  try {
    const { userId, resourceType } = req.query;
    const limit = parseInt(req.query.limit || '20', 10);
    const offset = parseInt(req.query.offset || '0', 10);

    const result = await activityService.getActivity({ limit, offset, userId, resourceType });
    response.success(res, result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getActivity };
