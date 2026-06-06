# TaskFlow — Next.js Full Stack Project


## Project Overview
TaskFlow is a full-stack task and project management app built entirely with **Next.js 14 App Router**. It demonstrates all required concepts: SSR, SSG, ISR, API Routes, Server Actions, database integration, authentication, and file-based routing.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** JSON file database (via Node.js `fs` module — no external DB server needed)
- **Auth:** JWT (jsonwebtoken) + bcryptjs + HTTP-only cookies
- **Icons/UI:** Custom Tailwind components

## Features
- ✅ User registration & login (JWT auth)
- ✅ Create, read, update, delete tasks
- ✅ Task status & priority management
- ✅ Tag system for tasks
- ✅ Due dates with overdue detection
- ✅ Project workspaces with custom colors
- ✅ Dashboard with real-time stats
- ✅ Completion rate tracking
- ✅ Filter tasks by status, priority, project
- ✅ Profile management
- ✅ Server Actions for all forms
- ✅ Full REST API

## How to Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/SUSHRUTO/FlowSpace
cd taskflow

# 2. Install dependencies
pnpm install

# 3. Copy environment variables
cp .env.example .env

# 4. Run development server
npm run dev

# 5. Open http://localhost:3000
```

## 🚀 Live Demo

```
🔗 Live App: https://your-domain.up.railway.app
```

## Environment Variables

```env
DATABASE_URL="file:./dev.db"          # Path to SQLite DB (not used — using JSON DB)
NEXTAUTH_SECRET="your-secret-key"     # Secret for session signing
NEXTAUTH_URL="http://localhost:3000"  # App URL
JWT_SECRET="your-jwt-secret"          # JWT signing secret
```

## Database Setup
No external database server needed! The app uses a JSON file stored at `data/db.json`. It is created automatically on first run.

## Routes / Pages

| Route | Type | Rendering |
|-------|------|-----------|
| `/` | Landing page | Static |
| `/auth/login` | Login | Client component |
| `/auth/register` | Register | Client component |
| `/dashboard` | Dashboard | **SSR** |
| `/tasks` | Task list | **SSR** |
| `/projects` | Projects | **ISR** (60s) |
| `/profile` | Profile | SSR |
| `/about` | Tech stack | **SSG** |

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/tasks` | Get all tasks (filterable) |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/[id]` | Get task by ID |
| PUT | `/api/tasks/[id]` | Full update task |
| PATCH | `/api/tasks/[id]` | Partial update task |
| DELETE | `/api/tasks/[id]` | Delete task |
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/[id]` | Update project |
| DELETE | `/api/projects/[id]` | Delete project |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/stats` | Dashboard stats |

## Server Actions (in `src/lib/actions.ts`)

| Action | Use Case |
|--------|----------|
| `registerAction` | Register form submission |
| `loginAction` | Login form submission |
| `logoutAction` | Logout button |
| `createTaskAction` | Task creation form |
| `updateTaskStatusAction` | Quick status change |
| `deleteTaskAction` | Task deletion |
| `createProjectAction` | Project creation form |
| `deleteProjectAction` | Project deletion |
| `updateProfileAction` | Profile update form |

**Server Actions vs API Routes:**
- **Server Actions** are used for form submissions that mutate data and need to revalidate the Next.js cache (using `revalidatePath`). They run on the server directly without a network round-trip.
- **API Routes** are used for external-facing RESTful endpoints that could be consumed by mobile apps, third-party clients, or tested via Postman/curl.

## Rendering Strategies

### SSR (Server Side Rendering)
- `/dashboard` — Personalized stats, recent tasks. Data changes per user per request.
- `/tasks` — User's task list with filters. Must be fresh every request.
- `/profile` — User-specific profile data.

### SSG (Static Site Generation)
- `/about` — Tech stack documentation. Never changes. Built once at compile time.
- `export const dynamic = "force-static"`

### ISR (Incremental Static Regeneration)
- `/projects` — Projects list. Revalidates every 60 seconds.
- `export const revalidate = 60`

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   ├── about/page.tsx          # SSG page
│   ├── dashboard/
│   │   ├── layout.tsx          # Protected layout with sidebar
│   │   └── page.tsx            # SSR dashboard
│   ├── tasks/page.tsx          # SSR tasks
│   ├── projects/page.tsx       # ISR projects
│   ├── profile/page.tsx        # SSR profile
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   └── api/
│       ├── tasks/route.ts      # GET, POST
│       ├── tasks/[id]/route.ts # GET, PUT, PATCH, DELETE
│       ├── projects/route.ts
│       ├── projects/[id]/route.ts
│       ├── auth/login/route.ts
│       ├── auth/register/route.ts
│       └── stats/route.ts
├── components/
│   ├── layout/Sidebar.tsx
│   ├── tasks/CreateTaskModal.tsx
│   ├── tasks/TaskActions.tsx
│   ├── projects/CreateProjectModal.tsx
│   ├── projects/ProjectCard.tsx
│   └── dashboard/ProfileForm.tsx
└── lib/
    ├── db.ts          # Database layer (CRUD operations)
    ├── auth.ts        # JWT auth helpers
    ├── actions.ts     # Server Actions
    └── utils.ts       # Utility functions
```

## Concepts from Class Covered
- [x] Next.js project setup with App Router
- [x] File-based routing (folder = route)
- [x] Layouts (`layout.tsx`) with nested routes
- [x] Server Side Rendering (`force-dynamic`)
- [x] Static Site Generation (`force-static`)
- [x] Incremental Static Regeneration (`revalidate`)
- [x] API Routes (GET, POST, PUT, PATCH, DELETE)
- [x] Database connection and CRUD
- [x] Structured API responses `{ success, data }`
- [x] Proper error handling with status codes
- [x] Server Actions with `"use server"` directive
- [x] `revalidatePath` in Server Actions
- [x] Middleware for route protection
- [x] HTTP-only cookies for auth
- [x] TypeScript throughout

## Assumptions & Limitations
- Uses a JSON file as database for simplicity (no external DB server needed for eval)
- In production, replace with PostgreSQL/MongoDB via Prisma
- No email verification (out of scope)
- Single-user per session (no team features)

## 👨‍💻 Author

```
Built by Sushruto Majumdar
```