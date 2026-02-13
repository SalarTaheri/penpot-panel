# Active Context: Penpot User Management Panel

## Project Status: ✅ In Development

A Persian web panel for managing self-hosted Penpot users with subscription plans and payment tracking.

## Recently Completed

- [x] Created SPEC.md with full project specification
- [x] Set up database with Drizzle ORM (SQLite)
- [x] Created database schema (users, plans, subscriptions, payments, credits, services, user_services)
- [x] Implemented authentication system with JWT cookies
- [x] Built admin panel with dashboard, users, plans, payments, services management
- [x] Built user panel with dashboard, plan management, billing, services
- [x] Added full Persian RTL support with Vazirmatn font
- [x] Created seed script with sample data

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/login/page.tsx` | Login page | ✅ Complete |
| `src/app/admin/page.tsx` | Admin dashboard | ✅ Complete |
| `src/app/admin/users/page.tsx` | User management | ✅ Complete |
| `src/app/admin/plans/page.tsx` | Plan management | ✅ Complete |
| `src/app/admin/payments/page.tsx` | Payment history | ✅ Complete |
| `src/app/admin/services/page.tsx` | Services management | ✅ Complete |
| `src/app/user/page.tsx` | User dashboard | ✅ Complete |
| `src/app/user/plan/page.tsx` | My plan | ✅ Complete |
| `src/app/user/billing/page.tsx` | Billing history | ✅ Complete |
| `src/app/user/services/page.tsx` | Additional services | ✅ Complete |
| `src/db/schema.ts` | Database schema | ✅ Complete |
| `src/lib/auth.ts` | Authentication | ✅ Complete |
| `src/lib/utils.ts` | Utilities & translations | ✅ Complete |

## Current Focus

Finalizing the implementation and testing the application.

## Test Credentials

- Admin: admin@penpot.ir / admin123
- User: user@penpot.ir / user123

## Quick Start

```bash
bun install          # Install dependencies
bun db:seed          # Seed database with sample data
bun dev              # Start development server
```

## Available Scripts

| Command | Purpose |
|---------|---------|
| `bun db:generate` | Generate database migrations |
| `bun db:migrate` | Run database migrations |
| `bun db:seed` | Seed database with sample data |

## Session History

| Date | Changes |
|------|---------|
| Initial | Base Next.js 16 template |
| Current | Full Penpot management panel implementation |
