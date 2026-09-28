/**
 * Project validators
 */
const { body, query, param } = require('express-validator');

const createProjectValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Project name is required')
    .isLength({ min: 2, max: 200 }).withMessage('Name must be 2–200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description must be under 2000 characters'),
  body('status')
    .optional()
    .isIn(['planning', 'active', 'on_hold', 'completed', 'archived'])
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid priority'),
  body('startDate')
    .optional()
    .isISO8601().withMessage('Start date must be a valid date'),
  body('dueDate')
    .optional()
    .isISO8601().withMessage('Due date must be a valid date'),
  body('memberIds')
    .optional()
    .isArray().withMessage('memberIds must be an array'),
];

const updateProjectValidator = [
  param('id').isUUID().withMessage('Invalid project ID'),
  ...createProjectValidator,
];

const projectQueryValidator = [
  query('status')
    .optional()
    .isIn(['planning', 'active', 'on_hold', 'completed', 'archived'])
    .withMessage('Invalid status filter'),
  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid priority filter'),
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

module.exports = { createProjectValidator, updateProjectValidator, projectQueryValidator };
