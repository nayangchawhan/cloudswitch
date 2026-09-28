-- CloudSwitch Seed Data
-- Realistic demo data for development and testing.
-- Run AFTER 001_initial_schema.sql

-- ─── USERS ─────────────────────────────────────────────────────────────────────
-- Passwords are all: "Password1" (bcrypt hash)
INSERT INTO users (id, name, email, password_hash, role, bio) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'Nayan Chawhan',
  'nayan@cloudswitch.dev',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewFfEfNLMLjsGp8i',
  'admin',
  'Full-stack developer and DevOps enthusiast building CloudSwitch.'
),
(
  '22222222-2222-2222-2222-222222222222',
  'Priya Sharma',
  'priya@cloudswitch.dev',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewFfEfNLMLjsGp8i',
  'project_manager',
  'Experienced project manager specializing in cloud migrations.'
),
(
  '33333333-3333-3333-3333-333333333333',
  'Rahul Verma',
  'rahul@cloudswitch.dev',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewFfEfNLMLjsGp8i',
  'developer',
  'Backend developer with expertise in Node.js and Kubernetes.'
),
(
  '44444444-4444-4444-4444-444444444444',
  'Ananya Patel',
  'ananya@cloudswitch.dev',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewFfEfNLMLjsGp8i',
  'developer',
  'Frontend developer passionate about accessible, beautiful UIs.'
),
(
  '55555555-5555-5555-5555-555555555555',
  'Alex Johnson',
  'alex@cloudswitch.dev',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewFfEfNLMLjsGp8i',
  'viewer',
  'Stakeholder and product owner reviewing CloudSwitch progress.'
)
ON CONFLICT (email) DO NOTHING;

-- ─── PROJECTS ──────────────────────────────────────────────────────────────────
INSERT INTO projects (id, name, description, owner_id, status, priority, start_date, due_date) VALUES
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'CloudSwitch Platform',
  'Core application platform — the React/Node.js layer that will be containerised and deployed to AWS EKS and Azure AKS.',
  '11111111-1111-1111-1111-111111111111',
  'active',
  'critical',
  '2026-01-01',
  '2026-12-31'
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Docker & Containerisation',
  'Create Dockerfiles, docker-compose, and multi-stage build pipelines for the CloudSwitch platform.',
  '11111111-1111-1111-1111-111111111111',
  'planning',
  'high',
  '2026-10-01',
  '2026-10-31'
),
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'Kubernetes Deployment',
  'Design and deploy Kubernetes manifests for EKS and AKS. Includes HPA, liveness/readiness probes, ConfigMaps, and Secrets.',
  '22222222-2222-2222-2222-222222222222',
  'planning',
  'high',
  '2026-11-01',
  '2026-11-30'
),
(
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'Terraform Infrastructure',
  'Infrastructure-as-code for AWS and Azure. VPCs, EKS/AKS clusters, RDS, ElastiCache, IAM, and networking.',
  '22222222-2222-2222-2222-222222222222',
  'planning',
  'critical',
  '2026-11-01',
  '2026-12-15'
),
(
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  'CI/CD Pipeline',
  'GitHub Actions workflows and Jenkins pipelines for automated testing, building, and deploying CloudSwitch.',
  '11111111-1111-1111-1111-111111111111',
  'planning',
  'high',
  '2026-11-15',
  '2026-12-15'
),
(
  'ffffffff-ffff-ffff-ffff-ffffffffffff',
  'Monitoring & Observability',
  'Prometheus metrics, Grafana dashboards, CloudWatch, and Azure Monitor integration.',
  '22222222-2222-2222-2222-222222222222',
  'planning',
  'medium',
  '2026-12-01',
  '2026-12-31'
)
ON CONFLICT (id) DO NOTHING;

-- ─── PROJECT MEMBERS ───────────────────────────────────────────────────────────
INSERT INTO project_members (project_id, user_id) VALUES
-- CloudSwitch Platform
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444'),
-- Docker project
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333'),
-- Kubernetes
('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333'),
-- Terraform
('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222'),
-- CI/CD
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333'),
-- Monitoring
('ffffffff-ffff-ffff-ffff-ffffffffffff', '22222222-2222-2222-2222-222222222222')
ON CONFLICT DO NOTHING;

-- ─── TASKS ─────────────────────────────────────────────────────────────────────
INSERT INTO tasks (id, title, description, project_id, assignee_id, created_by, status, priority, due_date) VALUES
-- CloudSwitch Platform tasks
('c1111111-1111-1111-1111-111111111111', 'Design database schema', 'Design the PostgreSQL schema for users, projects, tasks, notifications, and activity logs.', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'completed', 'critical', '2026-01-15'),
('c2222222-2222-2222-2222-222222222222', 'Implement REST API', 'Build all Express.js API routes with authentication, validation, and error handling.', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'completed', 'critical', '2026-02-15'),
('c3333333-3333-3333-3333-333333333333', 'Build React frontend', 'Create the complete React application with all pages, components, and API integration.', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'completed', 'critical', '2026-03-31'),
('c4444444-4444-4444-4444-444444444444', 'Redis caching layer', 'Add Redis caching for dashboard stats, project details, and rate limiting.', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'completed', 'high', '2026-04-15'),
('c5555555-5555-5555-5555-555555555555', 'JWT authentication', 'Implement JWT-based authentication with refresh tokens and role-based authorization.', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'completed', 'critical', '2026-02-28'),
('c6666666-6666-6666-6666-666666666666', 'Write API tests', 'Write comprehensive tests for auth, projects, tasks, and health endpoints.', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'in_progress', 'high', '2026-10-30'),
('c7777777-7777-7777-7777-777777777777', 'Kanban drag-and-drop', 'Implement drag-and-drop task reordering on the Kanban board.', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'review', 'medium', '2026-10-20'),
('c8888888-8888-8888-8888-888888888888', 'Responsive mobile layout', 'Ensure dashboard and project pages work on tablet and mobile screen sizes.', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'todo', 'medium', '2026-11-15'),
-- Docker project tasks
('c9999999-9999-9999-9999-999999999999', 'Write backend Dockerfile', 'Multi-stage Dockerfile for the Node.js API with production optimisation.', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'todo', 'critical', '2026-10-15'),
('caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Write frontend Dockerfile', 'Multi-stage Dockerfile for building and serving the React app with nginx.', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'todo', 'high', '2026-10-15'),
('cbbbbbb0-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Create docker-compose.yml', 'Docker Compose file for local development with hot-reload.', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'todo', 'high', '2026-10-20'),
-- K8s tasks
('ccccccc0-cccc-cccc-cccc-cccccccccccc', 'Create deployment manifests', 'Kubernetes Deployment, Service, and Ingress for API and frontend.', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'todo', 'critical', '2026-11-15'),
('cdddddd0-dddd-dddd-dddd-dddddddddddd', 'Configure liveness probes', 'Wire /api/v1/health/live and /api/v1/health/ready to Kubernetes probes.', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'todo', 'high', '2026-11-20'),
('ceeeeee0-eeee-eeee-eeee-eeeeeeeeeeee', 'Horizontal Pod Autoscaler', 'Configure HPA for the API based on CPU and memory metrics.', 'cccccccc-cccc-cccc-cccc-cccccccccccc', null, '22222222-2222-2222-2222-222222222222', 'todo', 'medium', '2026-11-25')
ON CONFLICT (id) DO NOTHING;

-- ─── TASK LABELS ───────────────────────────────────────────────────────────────
INSERT INTO task_labels (task_id, label) VALUES
('c1111111-1111-1111-1111-111111111111', 'database'),
('c1111111-1111-1111-1111-111111111111', 'design'),
('c2222222-2222-2222-2222-222222222222', 'backend'),
('c2222222-2222-2222-2222-222222222222', 'api'),
('c3333333-3333-3333-3333-333333333333', 'frontend'),
('c3333333-3333-3333-3333-333333333333', 'react'),
('c4444444-4444-4444-4444-444444444444', 'backend'),
('c4444444-4444-4444-4444-444444444444', 'cache'),
('c5555555-5555-5555-5555-555555555555', 'security'),
('c5555555-5555-5555-5555-555555555555', 'auth'),
('c6666666-6666-6666-6666-666666666666', 'testing'),
('c7777777-7777-7777-7777-777777777777', 'frontend'),
('c7777777-7777-7777-7777-777777777777', 'ux'),
('c9999999-9999-9999-9999-999999999999', 'docker'),
('caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'docker'),
('caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'frontend'),
('ccccccc0-cccc-cccc-cccc-cccccccccccc', 'kubernetes'),
('cdddddd0-dddd-dddd-dddd-dddddddddddd', 'kubernetes'),
('cdddddd0-dddd-dddd-dddd-dddddddddddd', 'health')
ON CONFLICT DO NOTHING;

-- ─── NOTIFICATIONS ─────────────────────────────────────────────────────────────
INSERT INTO notifications (user_id, title, message, type, related_resource_type, related_resource_id) VALUES
('33333333-3333-3333-3333-333333333333', 'Task assigned to you', 'You were assigned: Write API tests', 'task', 'task', 'c6666666-6666-6666-6666-666666666666'),
('44444444-4444-4444-4444-444444444444', 'Task in review', 'Kanban drag-and-drop is ready for review', 'task', 'task', 'c7777777-7777-7777-7777-777777777777'),
('11111111-1111-1111-1111-111111111111', 'Project created', 'Docker & Containerisation project has been created', 'project', 'project', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('22222222-2222-2222-2222-222222222222', 'You were added to a project', 'You were added to CloudSwitch Platform', 'project', 'project', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');

-- ─── ACTIVITY LOGS ─────────────────────────────────────────────────────────────
INSERT INTO activity_logs (user_id, action, resource_type, resource_id, description) VALUES
('11111111-1111-1111-1111-111111111111', 'user.registered', 'user', '11111111-1111-1111-1111-111111111111', 'Nayan Chawhan joined CloudSwitch'),
('22222222-2222-2222-2222-222222222222', 'user.registered', 'user', '22222222-2222-2222-2222-222222222222', 'Priya Sharma joined CloudSwitch'),
('33333333-3333-3333-3333-333333333333', 'user.registered', 'user', '33333333-3333-3333-3333-333333333333', 'Rahul Verma joined CloudSwitch'),
('44444444-4444-4444-4444-444444444444', 'user.registered', 'user', '44444444-4444-4444-4444-444444444444', 'Ananya Patel joined CloudSwitch'),
('11111111-1111-1111-1111-111111111111', 'project.created', 'project', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Created project "CloudSwitch Platform"'),
('11111111-1111-1111-1111-111111111111', 'project.created', 'project', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Created project "Docker & Containerisation"'),
('22222222-2222-2222-2222-222222222222', 'project.created', 'project', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Created project "Kubernetes Deployment"'),
('11111111-1111-1111-1111-111111111111', 'task.created', 'task', 'c1111111-1111-1111-1111-111111111111', 'Created task "Design database schema"'),
('33333333-3333-3333-3333-333333333333', 'task.updated', 'task', 'c1111111-1111-1111-1111-111111111111', 'Changed task "Design database schema" status from todo to completed'),
('33333333-3333-3333-3333-333333333333', 'task.updated', 'task', 'c2222222-2222-2222-2222-222222222222', 'Changed task "Implement REST API" status from in_progress to completed'),
('44444444-4444-4444-4444-444444444444', 'task.updated', 'task', 'c3333333-3333-3333-3333-333333333333', 'Changed task "Build React frontend" status from in_progress to completed'),
('44444444-4444-4444-4444-444444444444', 'task.updated', 'task', 'c7777777-7777-7777-7777-777777777777', 'Submitted Kanban drag-and-drop for review');
