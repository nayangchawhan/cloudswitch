# CloudSwitch

CloudSwitch is a cloud-agnostic Project & Operations Management Dashboard designed as the application layer for a comprehensive multi-cloud and DevOps learning journey.

## Architecture

Currently implemented as a modular monolith:

React (Frontend)
   ↓
Node.js API (Backend)
   ↓
PostgreSQL (Database)
   +
Redis (Cache/Session)

### Future Architecture

This application is designed to be container-friendly and stateless at the application layer, preparing it to evolve into:

React
 ↓
Docker
 ↓
Kubernetes
 ↓
AWS EKS / Azure AKS
 ↓
Terraform
 ↓
GitHub Actions / Jenkins

## Local Development

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- Redis

### Backend Setup
```bash
cd backend
npm install
# Set up environment variables
cp .env.example .env
# Start development server
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
# Start development server
npm run dev
```
