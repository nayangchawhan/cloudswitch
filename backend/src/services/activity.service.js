/**
 * Activity log service
 * Records all meaningful user and system events.
 */
const db = require('../db/pool');
const logger = require('../utils/logger');

/**
 * Log an activity event
 * @param {object} params
 * @param {string} params.userId - User who performed the action
 * @param {string} params.action - Action type e.g. 'project.created'
 * @param {string} params.resourceType - 'project', 'task', 'user', etc.
 * @param {string} params.resourceId - UUID of the resource
 * @param {string} params.description - Human-readable description
 * @param {object} [params.metadata] - Additional metadata (JSON)
 */
async function log({ userId, action, resourceType, resourceId, description, metadata = null }) {
  try {
    await db.query(
      `INSERT INTO activity_logs (user_id, action, resource_type, resource_id, description, metadata)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, action, resourceType, resourceId, description, metadata ? JSON.stringify(metadata) : null]
    );
  } catch (err) {
    // Activity logging should never crash the main request
    logger.error('Failed to log activity', { error: err.message, action, userId });
  }
}

/**
 * Get recent activity logs with user info
 * @param {object} opts
 * @param {number} opts.limit
 * @param {number} opts.offset
 * @param {string} [opts.userId] - Filter to a specific user
 * @param {string} [opts.resourceType] - Filter to a resource type
 */
async function getActivity({ limit = 20, offset = 0, userId = null, resourceType = null } = {}) {
  const conditions = [];
  const params = [];

  if (userId) {
    params.push(userId);
    conditions.push(`al.user_id = $${params.length}`);
  }

  if (resourceType) {
    params.push(resourceType);
    conditions.push(`al.resource_type = $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  params.push(limit, offset);

  const result = await db.query(
    `SELECT
       al.id,
       al.action,
       al.resource_type,
       al.resource_id,
       al.description,
       al.metadata,
       al.created_at,
       u.id AS user_id,
       u.name AS user_name,
       u.avatar_url AS user_avatar
     FROM activity_logs al
     LEFT JOIN users u ON al.user_id = u.id
     ${where}
     ORDER BY al.created_at DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  // Count query
  const countParams = params.slice(0, params.length - 2);
  const countResult = await db.query(
    `SELECT COUNT(*) FROM activity_logs al ${where}`,
    countParams
  );

  return {
    items: result.rows,
    total: parseInt(countResult.rows[0].count, 10),
  };
}

module.exports = { log, getActivity };
