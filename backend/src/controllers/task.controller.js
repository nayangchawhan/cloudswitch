/**
 * Task controller
 */
const taskService = require('../services/task.service');
const response = require('../utils/response');

async function getAll(req, res, next) {
  try {
    const { status, priority, projectId, assigneeId, search, sortBy, sortDir } = req.query;
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);

    const result = await taskService.getAll(
      { status, priority, projectId, assigneeId, search, sortBy, sortDir },
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
    const task = await taskService.getById(req.params.id);
    response.success(res, task);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const task = await taskService.create(req.body, req.user.id);
    response.created(res, task, 'Task created successfully');
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const task = await taskService.update(req.params.id, req.body, req.user);
    response.success(res, task, 'Task updated successfully');
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await taskService.remove(req.params.id, req.user);
    response.success(res, null, 'Task deleted successfully');
  } catch (err) {
    next(err);
  }
}

async function getKanbanBoard(req, res, next) {
  try {
    const board = await taskService.getKanbanBoard(req.params.projectId);
    response.success(res, board);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create, update, remove, getKanbanBoard };
