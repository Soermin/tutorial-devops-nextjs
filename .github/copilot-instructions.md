# Copilot Instructions for tutorial-devops-nextjs

## Project Overview

A DevOps-focused Next.js 16 + PostgreSQL tutorial application demonstrating containerized deployment with Docker Compose, Nginx reverse proxy, and Jenkins CI/CD.

## Architecture

**Technology Stack:**
- Frontend: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- Backend: Node.js 20 with Prisma ORM
- Database: PostgreSQL 16
- Infrastructure: Docker Compose, Nginx (reverse proxy), Jenkins pipeline
- Deployment: VM-based (172.16.113.192) via git pull & Docker Compose

**Service Structure (docker-compose.yml):**
- `app` - Next.js application (port 3000, standalone build)
- `postgres` - PostgreSQL database (tutorialdb, user: admin)
- `nginx` - Alpine nginx reverse proxy (port 80 → app:3000)

## Key Development Workflows

### Local Development
```bash
npm run dev          # Start Next.js dev server on http://localhost:3000
npm run build        # Build for production (generates .next/standalone)
npm run lint         # Run ESLint on codebase
```

### Database
- Prisma migrations: `npx prisma migrate dev --name <migration_name>`
- Studio: `npx prisma studio` (if running locally)
- Schema: [prisma/schema.prisma](../../prisma/schema.prisma) - PostgreSQL backend
- Model: `Tutorial` table with slug-based unique identifier

### Docker & Deployment
- **Build locally:** `docker compose up -d --build`
- **Production:** Next.js `output: 'standalone'` mode ([next.config.ts](../../next.config.ts))
- **Multi-stage Dockerfile:** Base → deps → builder → runner (Node.js as non-root `nextjs` user)
- **Nginx config:** [nginx/default.conf](../../nginx/default.conf) reverse proxies to app:3000 with WebSocket support

### CI/CD (Jenkins)
- Triggered on `develop` branch
- Pipeline stages: Clone → Build Validation → Deploy to VM2
- Deployment: SSH to VM2, git pull, docker compose redeploy
- Default environment: `NODE_ENV=production`, `NEXT_PUBLIC_APP_NAME=Tutorial DevOps`

## Project Conventions

**File Structure:**
- `src/app/` - Next.js App Router pages (page.tsx, layout.tsx)
- `prisma/schema.prisma` - Single data model (Tutorial)
- `.next/` - Build artifacts (generated, excluded from git)

**TypeScript:**
- Strict mode enabled (tsconfig.json)
- Component files use `.tsx`, server utilities use `.ts`
- Type definitions: `@types/node`, `@types/react`, `@types/react-dom`

**Styling:**
- Tailwind CSS v4 with PostCSS
- No CSS-in-JS; all classes in `globals.css` and inline className props
- Dark mode supported (`dark:` prefix in components)

**Database Pattern:**
- Prisma Client auto-generated from schema
- PostgreSQL connection via `DATABASE_URL` environment variable
- Slug field for Tutorial lookups (not ID-only queries)

## Critical Integration Points

1. **Next.js Standalone Build**
   - Config: [next.config.ts](../../next.config.ts) has `output: 'standalone'`
   - Dockerfile copies `/app/.next/standalone` to runner stage
   - Missing `prisma` directory copy in runner will break migrations at startup

2. **Environment Variables**
   - `DATABASE_URL` - PostgreSQL connection string (docker-compose: `postgresql://admin:password@postgres:5432/tutorialdb`)
   - `NEXT_PUBLIC_APP_NAME` - Public app name

3. **Docker Networking**
   - Service name `postgres` used in DATABASE_URL (Docker Compose DNS resolution)
   - Service name `app` used in Nginx upstream (not `localhost`)

4. **Jenkins SSH Deployment**
   - Expects `develop` branch on origin
   - Runs on remote VM2 as `staging-dev` user
   - App directory: `/home/staging-dev/project_devops/tutorial-devops-nextjs`

## Common Pitfalls to Avoid

- **Prisma generation:** Must run `npx prisma generate` before `npm run build` (Dockerfile does this in builder stage)
- **DATABASE_URL in production:** Must use service name `postgres` when in docker-compose, not `localhost`
- **Standalone build size:** Ensure Nginx reverse proxy is in place; Next.js itself cannot handle multiple concurrent requests as efficiently as with a dedicated proxy
- **Git branch assumption:** Jenkins pipeline only triggers on `develop` branch; PRs to `main` won't auto-deploy

## References

- [Prisma Schema](../../prisma/schema.prisma) - Single Tutorial model
- [Next.js Config](../../next.config.ts) - Standalone mode enabled
- [Dockerfile](../../Dockerfile) - Multi-stage build with Prisma generation
- [docker-compose.yml](../../docker-compose.yml) - Full stack orchestration
- [Jenkinsfile](../../Jenkinsfile) - CI/CD pipeline definition
