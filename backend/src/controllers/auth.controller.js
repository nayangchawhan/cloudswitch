/**
 * Auth controller
 */
const authService = require('../services/auth.service');
const response = require('../utils/response');

async function register(req, res, next) {
  try {
    const { user, token } = await authService.register(req.body);
    response.created(res, { user, token }, 'Account created successfully');
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { user, token } = await authService.login(req.body);
    response.success(res, { user, token }, 'Logged in successfully');
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await authService.getCurrentUser(req.user.id);
    response.success(res, user);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, me };
