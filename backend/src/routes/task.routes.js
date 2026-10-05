const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { createTaskValidator, updateTaskValidator, taskQueryValidator } = require('../validators/task.validator');
const { param } = require('express-validator');

// Kanban board for a project
router.get('/kanban/:projectId', authenticate, [param('projectId').isUUID()], validate, taskController.getKanbanBoard);
router.get('/board/:projectId', authenticate, [param('projectId').isUUID()], validate, taskController.getKanbanBoard);

// Task CRUD
router.get('/', authenticate, taskQueryValidator, validate, taskController.getAll);
router.post('/', authenticate, createTaskValidator, validate, taskController.create);
router.get('/:id', authenticate, [param('id').isUUID()], validate, taskController.getById);
router.put('/:id', authenticate, updateTaskValidator, validate, taskController.update);
router.delete('/:id', authenticate, [param('id').isUUID()], validate, taskController.remove);

module.exports = router;
