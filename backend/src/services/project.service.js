/**
 * Project service — business logic for projects
 */
const db = require('../db/pool');
const redis = require('./redis');
const activityService = require('./activity.service');
const notificationService = require('./notification.service');
const config = require('../config/env');
const { NotFoundError, AuthorizationError } = require('../utils/errors');

const CACHE_KEY = (id) => `project:${id}`;
const CACHE_LIST_KEY = 'projects:list';

/**
 * Build WHERE clause from filter options
 */
function buildFilters(filters) {
  const conditions = ['p.deleted_at IS NULL'];
  const params = [];

  if (filters.status) {
    params.push(filters.status);
    conditions.push(`p.status = $${params.length}`);
  }
  if (filters.priority) {
    params.push(filters.priority);
    conditions.push(`p.priority = $${params.length}`);
  }
  if (filters.ownerId) {
    params.push(filters.ownerId);
    conditions.push(`p.owner_id = $${params.length}`);
  }
  if (filters.search) {
    params.push(`%${filters.search}%`);
    conditions.push(`(p.name ILIKE $${params.length} OR p.description ILIKE $${params.length})`);
  }
  if (filters.memberId) {
    params.push(filters.memberId);
    conditions.push(
      `EXISTS (SELECT 1 FROM project_members pm WHERE pm.project_id = p.id AND pm.user_id = $${params.length})`
    );
  }

  return { conditions, params };
}

/**
 * Get all projects with filters/pagination
 */
async function getAll(filters = {}, page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const { conditions, params } = buildFilters(filters);
  const where = `WHERE ${conditions.join(' AND ')}`;

  const sortField = ['name', 'created_at', 'due_date', 'priority', 'status'].includes(filters.sortBy)
    ? `p.${filters.sortBy}`
    : 'p.created_at';
  const sortDir = filters.sortDir === 'asc' ? 'ASC' : 'DESC';

  params.push(limit, offset);

  const [rows, count] = await Promise.all([
    db.query(
      `SELECT
         p.*,
         u.name AS owner_name,
         u.avatar_url AS owner_avatar,
         COUNT(DISTINCT t.id) AS task_count,
         COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'completed') AS completed_task_count,
         COUNT(DISTINCT pm.user_id) AS member_count
       FROM projects p
       LEFT JOIN users u ON p.owner_id = u.id
       LEFT JOIN tasks t ON t.project_id = p.id AND t.deleted_at IS NULL
       LEFT JOIN project_members pm ON pm.project_id = p.id
       ${where}
       GROUP BY p.id, u.name, u.avatar_url
       ORDER BY ${sortField} ${sortDir}
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    ),
    db.query(
      `SELECT COUNT(DISTINCT p.id) FROM projects p ${where}`,
      params.slice(0, -2)
    ),
  ]);

  return {
    items: rows.rows,
    total: parseInt(count.rows[0].count, 10),
    page,
    limit,
  };
}

/**
 * Get a project by ID with full details
 */
async function getById(projectId, requestingUserId = null) {
  // Try cache first
  const cached = await redis.get(CACHE_KEY(projectId));
  if (cached) return cached;

  const result = await db.query(
    `SELECT
       p.*,
       u.name AS owner_name,
       u.avatar_url AS owner_avatar,
       u.email AS owner_email
     FROM projects p
     LEFT JOIN users u ON p.owner_id = u.id
     WHERE p.id = $1 AND p.deleted_at IS NULL`,
    [projectId]
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('Project');
  }

  const project = result.rows[0];

  // Get members
  const members = await db.query(
    `SELECT u.id, u.name, u.email, u.role, u.avatar_url, pm.joined_at
     FROM project_members pm
     JOIN users u ON pm.user_id = u.id
     WHERE pm.project_id = $1`,
    [projectId]
  );
  project.members = members.rows;

  // Get task summary
  const taskSummary = await db.query(
    `SELECT status, COUNT(*) AS count
     FROM tasks
     WHERE project_id = $1 AND deleted_at IS NULL
     GROUP BY status`,
    [projectId]
  );
  project.taskSummary = taskSummary.rows;

  // Calculate progress
  const total = taskSummary.rows.reduce((sum, r) => sum + parseInt(r.count), 0);
  const completed = taskSummary.rows.find((r) => r.status === 'completed');
  project.progress = total > 0 ? Math.round((parseInt(completed?.count || 0) / total) * 100) : 0;
  project.taskCount = total;

  await redis.set(CACHE_KEY(projectId), project, config.cacheTtlProjects);

  return project;
}

/**
 * Create a new project
 */
async function create(data, ownerId) {
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    const result = await client.query(
      `INSERT INTO projects (name, description, owner_id, status, priority, start_date, due_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        data.name,
        data.description || null,
        ownerId,
        data.status || 'planning',
        data.priority || 'medium',
        data.startDate || null,
        data.dueDate || null,
      ]
    );

    const project = result.rows[0];

    // Always add owner as a member
    await client.query(
      `INSERT INTO project_members (project_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [project.id, ownerId]
    );

    // Add additional members
    if (data.memberIds && data.memberIds.length > 0) {
      for (const memberId of data.memberIds) {
        if (memberId !== ownerId) {
          await client.query(
            `INSERT INTO project_members (project_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [project.id, memberId]
          );
        }
      }
    }

    await client.query('COMMIT');

    await activityService.log({
      userId: ownerId,
      action: 'project.created',
      resourceType: 'project',
      resourceId: project.id,
      description: `Created project "${project.name}"`,
    });

    await redis.invalidatePattern('dashboard:*');
    return project;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Update a project
 */
async function update(projectId, data, requestingUser) {
  const project = await getById(projectId);

  // Only owner or admin can update
  if (project.owner_id !== requestingUser.id && requestingUser.role !== 'admin') {
    throw new AuthorizationError('Only the project owner or an admin can update this project');
  }

  const result = await db.query(
    `UPDATE projects
     SET name = COALESCE($1, name),
         description = COALESCE($2, description),
         status = COALESCE($3, status),
         priority = COALESCE($4, priority),
         start_date = COALESCE($5, start_date),
         due_date = COALESCE($6, due_date),
         updated_at = NOW()
     WHERE id = $7
     RETURNING *`,
    [data.name, data.description, data.status, data.priority, data.startDate, data.dueDate, projectId]
  );

  await activityService.log({
    userId: requestingUser.id,
    action: 'project.updated',
    resourceType: 'project',
    resourceId: projectId,
    description: `Updated project "${result.rows[0].name}"`,
  });

  await redis.del(CACHE_KEY(projectId));
  await redis.invalidatePattern('dashboard:*');

  return result.rows[0];
}

/**
 * Soft-delete (archive) a project
 */
async function remove(projectId, requestingUser) {
  const project = await getById(projectId);

  if (project.owner_id !== requestingUser.id && requestingUser.role !== 'admin') {
    throw new AuthorizationError('Only the project owner or an admin can delete this project');
  }

  await db.query(
    `UPDATE projects SET deleted_at = NOW(), status = 'archived' WHERE id = $1`,
    [projectId]
  );

  await activityService.log({
    userId: requestingUser.id,
    action: 'project.deleted',
    resourceType: 'project',
    resourceId: projectId,
    description: `Archived project "${project.name}"`,
  });

  await redis.del(CACHE_KEY(projectId));
  await redis.invalidatePattern('dashboard:*');
}

/**
 * Add a member to a project
 */
async function addMember(projectId, userId, requestingUser) {
  await getById(projectId); // ensure exists

  await db.query(
    `INSERT INTO project_members (project_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
    [projectId, userId]
  );

  await notificationService.create({
    userId,
    title: 'Added to project',
    message: `You were added to a project`,
    type: 'info',
    relatedResourceType: 'project',
    relatedResourceId: projectId,
  });

  await redis.del(CACHE_KEY(projectId));
}

/**
 * Get dashboard statistics (with Redis caching)
 */
async function getDashboardStats(userId) {
  const cacheKey = `dashboard:stats:${userId}`;
  const cached = await redis.get(cacheKey);
  if (cached) return cached;

  const [projectStats, taskStats, recentProjects] = await Promise.all([
    db.query(
      `SELECT
         COUNT(*) AS total_projects,
         COUNT(*) FILTER (WHERE status = 'active') AS active_projects,
         COUNT(*) FILTER (WHERE status = 'completed') AS completed_projects,
         COUNT(*) FILTER (WHERE status = 'on_hold') AS on_hold_projects
       FROM projects
       WHERE owner_id = $1 OR id IN (SELECT project_id FROM project_members WHERE user_id = $1)
       AND deleted_at IS NULL`,
      [userId]
    ),
    db.query(
      `SELECT
         COUNT(*) AS total_tasks,
         COUNT(*) FILTER (WHERE status = 'todo') AS todo_count,
         COUNT(*) FILTER (WHERE status = 'in_progress') AS in_progress_count,
         COUNT(*) FILTER (WHERE status = 'review') AS review_count,
         COUNT(*) FILTER (WHERE status = 'completed') AS completed_count
       FROM tasks
       WHERE (assignee_id = $1 OR created_by = $1) AND deleted_at IS NULL`,
      [userId]
    ),
    db.query(
      `SELECT p.id, p.name, p.status, p.priority, p.due_date,
              COUNT(t.id) AS task_count,
              COUNT(t.id) FILTER (WHERE t.status = 'completed') AS completed_tasks
       FROM projects p
       LEFT JOIN tasks t ON t.project_id = p.id AND t.deleted_at IS NULL
       WHERE (p.owner_id = $1 OR p.id IN (SELECT project_id FROM project_members WHERE user_id = $1))
         AND p.deleted_at IS NULL
       GROUP BY p.id
       ORDER BY p.updated_at DESC
       LIMIT 5`,
      [userId]
    ),
  ]);

  const stats = {
    projects: projectStats.rows[0],
    tasks: taskStats.rows[0],
    recentProjects: recentProjects.rows,
  };

  await redis.set(cacheKey, stats, config.cacheTtlDashboard);
  return stats;
}

module.exports = { getAll, getById, create, update, remove, addMember, getDashboardStats };
