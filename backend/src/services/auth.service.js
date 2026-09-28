/**
 * Authentication service
 * Handles user registration, login, and token generation.
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/pool');
const config = require('../config/env');
const logger = require('../utils/logger');
const activityService = require('./activity.service');
const { ConflictError, AuthenticationError, NotFoundError } = require('../utils/errors');

/**
 * Generate a signed JWT for the given user
 */
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

/**
 * Register a new user
 */
async function register({ name, email, password, role = 'developer' }) {
  // Check for existing user
  const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    throw new ConflictError('An account with this email already exists', 'EMAIL_ALREADY_EXISTS');
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const result = await db.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, avatar_url, created_at`,
    [name, email, passwordHash, role]
  );

  const user = result.rows[0];
  const token = generateToken(user);

  await activityService.log({
    userId: user.id,
    action: 'user.registered',
    resourceType: 'user',
    resourceId: user.id,
    description: `${user.name} joined CloudSwitch`,
  });

  logger.info('User registered', { userId: user.id, email: user.email });

  return { user, token };
}

/**
 * Login with email and password
 */
async function login({ email, password }) {
  const result = await db.query(
    `SELECT id, name, email, password_hash, role, avatar_url, created_at
     FROM users WHERE email = $1`,
    [email]
  );

  if (result.rows.length === 0) {
    throw new AuthenticationError('Invalid email or password');
  }

  const user = result.rows[0];
  const isValid = await bcrypt.compare(password, user.password_hash);

  if (!isValid) {
    throw new AuthenticationError('Invalid email or password');
  }

  const token = generateToken(user);

  // Update last_login_at
  await db.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);

  const { password_hash: _, ...safeUser } = user;

  logger.info('User logged in', { userId: user.id });

  return { user: safeUser, token };
}

/**
 * Get the current authenticated user's profile
 */
async function getCurrentUser(userId) {
  const result = await db.query(
    `SELECT id, name, email, role, avatar_url, bio, created_at, last_login_at
     FROM users WHERE id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('User');
  }

  return result.rows[0];
}

module.exports = { register, login, getCurrentUser, generateToken };
