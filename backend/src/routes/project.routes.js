const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  createProjectValidator,
  updateProjectValidator,
  projectQueryValidator,
} = require('../validators/project.validator');
const { param } = require('express-validator');

// Dashboard stats endpoint
router.get('/dashboard', authenticate, projectController.getDashboardStats);
router.get('/dashboard/stats', authenticate, projectController.getDashboardStats);

// Project CRUD
router.get('/', authenticate, projectQueryValidator, validate, projectController.getAll);
router.post('/', authenticate, createProjectValidator, validate, projectController.create);
router.get('/:id', authenticate, [param('id').isUUID()], validate, projectController.getById);
router.put('/:id', authenticate, updateProjectValidator, validate, projectController.update);
router.delete('/:id', authenticate, [param('id').isUUID()], validate, projectController.remove);

// Project membership
router.post('/:id/members', authenticate, authorize('admin', 'project_manager'), projectController.addMember);

module.exports = router;
