# Leads CRM (RevenueOS)

A full-stack **sales & lead-management CRM** built with **Next.js 15 (App Router)** + **Prisma** + a local **SQLite** database. It gives sales teams a unified view of leads, contacts, deals, and meetings with AI-assisted insights.

## Features

- **Dashboard** — KPI stats, AI executive summary, revenue forecast, action queue
- **Leads (Contacts)** — searchable table, smart segments (Hot / Cold), source filters, add-lead drawer, per-lead detail popup
- **Companies** — searchable account directory, account detail, associated contacts, AI account intelligence
- **Deals (Kanban)** — drag-and-drop pipeline with 6 color-coded stages, custom **Pipeline filter** (Direct / Partner), health filter, saved views, analytics panel
- **Tasks** — grouped by Overdue / Today / Tomorrow / This Week / Completed (color-coded)
- **Meetings** — month / week / day calendar, drag-drop scheduling, new-meeting modal
- **WhatsApp CRM** — chat list and composed message UI
- **Settings** — 22 sections (profile, security, billing, integrations, AI, WhatsApp content, and more)
- **Quick Actions** — New Lead, New Deal, Send WhatsApp, Broadcast, Schedule Meeting, Add Note

## Tech Stack

- **Framework:** Next.js 15 (App Router, React 19)
- **UI:** Tailwind CSS + Lucide icons
- **Database:** SQLite with **Prisma ORM**
- **State:** Zustand
- **Charts:** Recharts

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up the database

```bash
npx prisma db push
npx prisma db seed   # loads demo data (leads, deals, stages, pipelines, etc.)
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Local only:** the database currently uses SQLite (`prisma/dev.db`). For production deploys, switch the Prisma provider to `postgresql` and set a cloud `DATABASE_URL` (e.g. Neon, Supabase) in your environment variables.

## Project Structure

```
src/
  app/
    api/            # REST endpoints (crm, leads, deals, meetings, ...)
    console/        # the CRM dashboard shell
    page.tsx        # public landing page
  components/
    console/        # dashboard views + Quick Action modals
  lib/              # Prisma client, Zustand stores
prisma/
  schema.prisma     # data models
  seed.js           # demo seed data
```

## API Overview

| Endpoint | Purpose |
| --- | --- |
| `GET/POST /api/crm` | Unified CRM data (leads, deals, stages, activities, workflows, integrations) |
| `GET/POST /api/leads` | Lead CRUD |
| `GET/POST /api/deals` | Deal CRUD |
| `POST /api/meetings` | Meeting scheduling |
| `GET/POST /api/activities` | Activity logging |
| `POST /api/notes` | Notes |
| `GET /api/dashboard` | Dashboard stats |

## License

Private project.