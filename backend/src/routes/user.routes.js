const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middleware/auth');
const { param } = require('express-validator');
const { validate } = require('../middleware/validate');

router.get('/', authenticate, userController.getAll);
router.get('/:id', authenticate, [param('id').isUUID()], validate, userController.getById);
router.put('/me/profile', authenticate, userController.updateProfile);
router.put('/:id/role', authenticate, authorize('admin'), [param('id').isUUID()], validate, userController.updateRole);

module.exports = router;
