/**
 * Project controller
 */
const projectService = require('../services/project.service');
const response = require('../utils/response');

async function getAll(req, res, next) {
  try {
    const { status, priority, search, ownerId, sortBy, sortDir } = req.query;
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);

    const result = await projectService.getAll(
      { status, priority, search, ownerId, sortBy, sortDir },
      page,
      limit
    );

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
    const project = await projectService.getById(req.params.id, req.user.id);
    response.success(res, project);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const project = await projectService.create(req.body, req.user.id);
    response.created(res, project, 'Project created successfully');
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const project = await projectService.update(req.params.id, req.body, req.user);
    response.success(res, project, 'Project updated successfully');
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await projectService.remove(req.params.id, req.user);
    response.success(res, null, 'Project archived successfully');
  } catch (err) {
    next(err);
  }
}

async function addMember(req, res, next) {
  try {
    await projectService.addMember(req.params.id, req.body.userId, req.user);
    response.success(res, null, 'Member added to project');
  } catch (err) {
    next(err);
  }
}

async function getDashboardStats(req, res, next) {
  try {
    const stats = await projectService.getDashboardStats(req.user.id);
    response.success(res, stats);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create, update, remove, addMember, getDashboardStats };
