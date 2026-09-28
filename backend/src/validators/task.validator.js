/**
 * Task validators
 */
const { body, query, param } = require('express-validator');

const createTaskValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Task title is required')
    .isLength({ min: 2, max: 300 }).withMessage('Title must be 2–300 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Description must be under 5000 characters'),
  body('projectId')
    .notEmpty().withMessage('Project ID is required')
    .isUUID().withMessage('Project ID must be a valid UUID'),
  body('assigneeId')
    .optional()
    .isUUID().withMessage('Assignee ID must be a valid UUID'),
  body('status')
    .optional()
    .isIn(['todo', 'in_progress', 'review', 'completed'])
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid priority'),
  body('dueDate')
    .optional()
    .isISO8601().withMessage('Due date must be a valid date'),
  body('labels')
    .optional()
    .isArray().withMessage('Labels must be an array'),
  body('labels.*')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 50 }).withMessage('Each label must be under 50 characters'),
];

const updateTaskValidator = [
  param('id').isUUID().withMessage('Invalid task ID'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 300 }).withMessage('Title must be 2–300 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Description must be under 5000 characters'),
  body('assigneeId')
    .optional({ nullable: true })
    .isUUID().withMessage('Assignee ID must be a valid UUID'),
  body('status')
    .optional()
    .isIn(['todo', 'in_progress', 'review', 'completed'])
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid priority'),
  body('dueDate')
    .optional({ nullable: true })
    .isISO8601().withMessage('Due date must be a valid date'),
  body('labels')
    .optional()
    .isArray().withMessage('Labels must be an array'),
];

const taskQueryValidator = [
  query('status')
    .optional()
    .isIn(['todo', 'in_progress', 'review', 'completed'])
    .withMessage('Invalid status filter'),
  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid priority filter'),
  query('projectId')
    .optional()
    .isUUID().withMessage('projectId must be a valid UUID'),
  query('assigneeId')
    .optional()
    .isUUID().withMessage('assigneeId must be a valid UUID'),
  query('search')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Search term too long'),
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1–100'),
];

module.exports = { createTaskValidator, updateTaskValidator, taskQueryValidator };
