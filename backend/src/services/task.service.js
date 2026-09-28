/**
 * Task service — business logic for tasks
 */
const db = require('../db/pool');
const redis = require('./redis');
const activityService = require('./activity.service');
const notificationService = require('./notification.service');
const { NotFoundError, AuthorizationError } = require('../utils/errors');

/**
 * Get all tasks with filters/pagination
 */
async function getAll(filters = {}, page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const conditions = ['t.deleted_at IS NULL'];
  const params = [];

  if (filters.status) {
    params.push(filters.status);
    conditions.push(`t.status = $${params.length}`);
  }
  if (filters.priority) {
    params.push(filters.priority);
    conditions.push(`t.priority = $${params.length}`);
  }
  if (filters.projectId) {
    params.push(filters.projectId);
    conditions.push(`t.project_id = $${params.length}`);
  }
  if (filters.assigneeId) {
    params.push(filters.assigneeId);
    conditions.push(`t.assignee_id = $${params.length}`);
  }
  if (filters.search) {
    params.push(`%${filters.search}%`);
    conditions.push(`(t.title ILIKE $${params.length} OR t.description ILIKE $${params.length})`);
  }

  const where = `WHERE ${conditions.join(' AND ')}`;

  const sortField = ['title', 'created_at', 'due_date', 'priority', 'status'].includes(filters.sortBy)
    ? `t.${filters.sortBy}`
    : 't.created_at';
  const sortDir = filters.sortDir === 'asc' ? 'ASC' : 'DESC';

  params.push(limit, offset);

  const [rows, count] = await Promise.all([
    db.query(
      `SELECT
         t.*,
         assignee.name AS assignee_name,
         assignee.avatar_url AS assignee_avatar,
         creator.name AS creator_name,
         p.name AS project_name,
         COALESCE(
           (SELECT json_agg(tl.label) FROM task_labels tl WHERE tl.task_id = t.id),
           '[]'
         ) AS labels
       FROM tasks t
       LEFT JOIN users assignee ON t.assignee_id = assignee.id
       LEFT JOIN users creator ON t.created_by = creator.id
       LEFT JOIN projects p ON t.project_id = p.id
       ${where}
       ORDER BY ${sortField} ${sortDir}
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    ),
    db.query(`SELECT COUNT(*) FROM tasks t ${where}`, params.slice(0, -2)),
  ]);

  return {
    items: rows.rows,
    total: parseInt(count.rows[0].count, 10),
    page,
    limit,
  };
}

/**
 * Get a task by ID
 */
async function getById(taskId) {
  const result = await db.query(
    `SELECT
       t.*,
       assignee.name AS assignee_name,
       assignee.avatar_url AS assignee_avatar,
       assignee.email AS assignee_email,
       creator.name AS creator_name,
       p.name AS project_name,
       p.id AS project_id,
       COALESCE(
         (SELECT json_agg(tl.label) FROM task_labels tl WHERE tl.task_id = t.id),
         '[]'
       ) AS labels
     FROM tasks t
     LEFT JOIN users assignee ON t.assignee_id = assignee.id
     LEFT JOIN users creator ON t.created_by = creator.id
     LEFT JOIN projects p ON t.project_id = p.id
     WHERE t.id = $1 AND t.deleted_at IS NULL`,
    [taskId]
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('Task');
  }

  return result.rows[0];
}

/**
 * Create a task
 */
async function create(data, createdBy) {
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    const result = await client.query(
      `INSERT INTO tasks (title, description, project_id, assignee_id, created_by, status, priority, due_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        data.title,
        data.description || null,
        data.projectId,
        data.assigneeId || null,
        createdBy,
        data.status || 'todo',
        data.priority || 'medium',
        data.dueDate || null,
      ]
    );

    const task = result.rows[0];

    // Insert labels
    if (data.labels && data.labels.length > 0) {
      for (const label of data.labels) {
        await client.query(
          `INSERT INTO task_labels (task_id, label) VALUES ($1, $2)`,
          [task.id, label.trim()]
        );
      }
    }

    await client.query('COMMIT');

    await activityService.log({
      userId: createdBy,
      action: 'task.created',
      resourceType: 'task',
      resourceId: task.id,
      description: `Created task "${task.title}"`,
      metadata: { projectId: data.projectId },
    });

    // Notify assignee if different from creator
    if (data.assigneeId && data.assigneeId !== createdBy) {
      await notificationService.create({
        userId: data.assigneeId,
        title: 'Task assigned to you',
        message: `You were assigned the task: "${task.title}"`,
        type: 'task',
        relatedResourceType: 'task',
        relatedResourceId: task.id,
      });
    }

    await redis.invalidatePattern('dashboard:*');
    return task;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Update a task
 */
async function update(taskId, data, requestingUser) {
  const existing = await getById(taskId);

  const result = await db.query(
    `UPDATE tasks
     SET title = COALESCE($1, title),
         description = COALESCE($2, description),
         assignee_id = CASE WHEN $3::uuid IS NOT NULL THEN $3::uuid ELSE assignee_id END,
         status = COALESCE($4, status),
         priority = COALESCE($5, priority),
         due_date = COALESCE($6, due_date),
         updated_at = NOW()
     WHERE id = $7
     RETURNING *`,
    [data.title, data.description, data.assigneeId || null, data.status, data.priority, data.dueDate, taskId]
  );

  const updated = result.rows[0];

  // Update labels if provided
  if (data.labels !== undefined) {
    await db.query('DELETE FROM task_labels WHERE task_id = $1', [taskId]);
    if (data.labels.length > 0) {
      for (const label of data.labels) {
        await db.query('INSERT INTO task_labels (task_id, label) VALUES ($1, $2)', [taskId, label.trim()]);
      }
    }
  }

  // Log status change
  const description = data.status && data.status !== existing.status
    ? `Changed task "${updated.title}" status from ${existing.status} to ${data.status}`
    : `Updated task "${updated.title}"`;

  await activityService.log({
    userId: requestingUser.id,
    action: 'task.updated',
    resourceType: 'task',
    resourceId: taskId,
    description,
  });

  // Notify new assignee
  if (data.assigneeId && data.assigneeId !== existing.assignee_id && data.assigneeId !== requestingUser.id) {
    await notificationService.create({
      userId: data.assigneeId,
      title: 'Task assigned to you',
      message: `You were assigned the task: "${updated.title}"`,
      type: 'task',
      relatedResourceType: 'task',
      relatedResourceId: taskId,
    });
  }

  await redis.invalidatePattern('dashboard:*');
  return updated;
}

/**
 * Soft-delete a task
 */
async function remove(taskId, requestingUser) {
  const task = await getById(taskId);

  if (task.created_by !== requestingUser.id && requestingUser.role !== 'admin' && requestingUser.role !== 'project_manager') {
    throw new AuthorizationError('You do not have permission to delete this task');
  }

  await db.query(`UPDATE tasks SET deleted_at = NOW() WHERE id = $1`, [taskId]);

  await activityService.log({
    userId: requestingUser.id,
    action: 'task.deleted',
    resourceType: 'task',
    resourceId: taskId,
    description: `Deleted task "${task.title}"`,
  });

  await redis.invalidatePattern('dashboard:*');
}

/**
 * Get tasks for Kanban board (grouped by status)
 */
async function getKanbanBoard(projectId) {
  const result = await db.query(
    `SELECT
       t.*,
       assignee.name AS assignee_name,
       assignee.avatar_url AS assignee_avatar,
       COALESCE(
         (SELECT json_agg(tl.label) FROM task_labels tl WHERE tl.task_id = t.id),
         '[]'
       ) AS labels
     FROM tasks t
     LEFT JOIN users assignee ON t.assignee_id = assignee.id
     WHERE t.project_id = $1 AND t.deleted_at IS NULL
     ORDER BY t.created_at ASC`,
    [projectId]
  );

  const board = {
    todo: [],
    in_progress: [],
    review: [],
    completed: [],
  };

  for (const task of result.rows) {
    const col = task.status;
    if (board[col] !== undefined) {
      board[col].push(task);
    }
  }

  return board;
}

module.exports = { getAll, getById, create, update, remove, getKanbanBoard };
