/**
 * User controller
 */
const userService = require('../services/user.service');
const response = require('../utils/response');

async function getAll(req, res, next) {
  try {
    const { search, role } = req.query;
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);

    const result = await userService.getAll({ search, role, page, limit });

    response.paginated(res, result.items, {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: Math.ceil(result.total / result.limit),
    });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const user = await userService.getById(req.params.id);
    response.success(res, user);
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const user = await userService.updateProfile(req.user.id, req.body);
    response.success(res, user, 'Profile updated successfully');
  } catch (err) {
    next(err);
  }
}

async function updateRole(req, res, next) {
  try {
    await userService.updateRole(req.params.id, req.body.role);
    response.success(res, null, 'User role updated');
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, updateProfile, updateRole };
