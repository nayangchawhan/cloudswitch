/**
 * Notification service
 */
const db = require('../db/pool');

/**
 * Create a notification for a user
 */
async function create({ userId, title, message, type = 'info', relatedResourceType = null, relatedResourceId = null }) {
  const result = await db.query(
    `INSERT INTO notifications (user_id, title, message, type, related_resource_type, related_resource_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [userId, title, message, type, relatedResourceType, relatedResourceId]
  );
  return result.rows[0];
}

/**
 * Get notifications for a user
 */
async function getForUser(userId, { limit = 20, offset = 0, unreadOnly = false } = {}) {
  const conditions = ['user_id = $1'];
  const params = [userId];

  if (unreadOnly) {
    conditions.push('read_at IS NULL');
  }

  params.push(limit, offset);

  const result = await db.query(
    `SELECT * FROM notifications
     WHERE ${conditions.join(' AND ')}
     ORDER BY created_at DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  const countResult = await db.query(
    `SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND read_at IS NULL`,
    [userId]
  );

  return {
    items: result.rows,
    unreadCount: parseInt(countResult.rows[0].count, 10),
  };
}

/**
 * Mark a notification as read
 */
async function markRead(notificationId, userId) {
  const result = await db.query(
    `UPDATE notifications
     SET read_at = NOW()
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [notificationId, userId]
  );
  return result.rows[0] || null;
}

/**
 * Mark all notifications as read
 */
async function markAllRead(userId) {
  await db.query(
    `UPDATE notifications SET read_at = NOW() WHERE user_id = $1 AND read_at IS NULL`,
    [userId]
  );
}

module.exports = { create, getForUser, markRead, markAllRead };
