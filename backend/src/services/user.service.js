/**
 * User service
 */
const db = require('../db/pool');
const { NotFoundError } = require('../utils/errors');

/**
 * Get all users (team list)
 */
async function getAll({ search = null, role = null, page = 1, limit = 20 } = {}) {
  const conditions = [];
  const params = [];

  if (search) {
    params.push(`%${search}%`);
    conditions.push(`(name ILIKE $${params.length} OR email ILIKE $${params.length})`);
  }
  if (role) {
    params.push(role);
    conditions.push(`role = $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (page - 1) * limit;
  params.push(limit, offset);

  const [users, count] = await Promise.all([
    db.query(
      `SELECT
         u.id, u.name, u.email, u.role, u.avatar_url, u.bio, u.created_at, u.last_login_at,
         COUNT(DISTINCT pm.project_id) AS project_count,
         COUNT(DISTINCT t.id) AS active_task_count
       FROM users u
       LEFT JOIN project_members pm ON pm.user_id = u.id
       LEFT JOIN tasks t ON t.assignee_id = u.id AND t.status != 'completed' AND t.deleted_at IS NULL
       ${where}
       GROUP BY u.id
       ORDER BY u.name ASC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    ),
    db.query(`SELECT COUNT(*) FROM users ${where}`, params.slice(0, -2)),
  ]);

  return {
    items: users.rows,
    total: parseInt(count.rows[0].count, 10),
    page,
    limit,
  };
}

/**
 * Get user by ID with details
 */
async function getById(userId) {
  const result = await db.query(
    `SELECT
       u.id, u.name, u.email, u.role, u.avatar_url, u.bio, u.created_at, u.last_login_at,
       (SELECT COUNT(*) FROM project_members pm WHERE pm.user_id = u.id) AS project_count,
       (SELECT COUNT(*) FROM tasks t WHERE t.assignee_id = u.id AND t.deleted_at IS NULL) AS total_tasks,
       (SELECT COUNT(*) FROM tasks t WHERE t.assignee_id = u.id AND t.status = 'completed' AND t.deleted_at IS NULL) AS completed_tasks
     FROM users u
     WHERE u.id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('User');
  }

  const user = result.rows[0];

  // Get user's projects
  const projects = await db.query(
    `SELECT p.id, p.name, p.status, p.priority
     FROM projects p
     JOIN project_members pm ON pm.project_id = p.id
     WHERE pm.user_id = $1 AND p.deleted_at IS NULL
     ORDER BY p.updated_at DESC
     LIMIT 10`,
    [userId]
  );

  user.projects = projects.rows;
  return user;
}

/**
 * Update user profile
 */
async function updateProfile(userId, { name, bio, avatarUrl }) {
  const result = await db.query(
    `UPDATE users
     SET name = COALESCE($1, name),
         bio = COALESCE($2, bio),
         avatar_url = COALESCE($3, avatar_url),
         updated_at = NOW()
     WHERE id = $4
     RETURNING id, name, email, role, avatar_url, bio, created_at`,
    [name, bio, avatarUrl, userId]
  );

  return result.rows[0];
}

/**
 * Update user role (admin only)
 */
async function updateRole(userId, role) {
  await db.query(`UPDATE users SET role = $1 WHERE id = $2`, [role, userId]);
}

module.exports = { getAll, getById, updateProfile, updateRole };
