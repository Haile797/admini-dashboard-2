# Mini Admin Dashboard

Mini Admin Dashboard is a full-stack admin system built with Next.js App Router.
The project demonstrates authentication, role-based access control (RBAC),
CRUD operations, dashboard analytics, and basic CI/CD.

---

## Tech Stack

- Framework: Next.js 14 (App Router)
- Language: TypeScript (strict)
- UI: TailwindCSS, shadcn/ui
- Auth: NextAuth (Credentials Provider, JWT)
- Database: PostgreSQL (Neon)
- ORM: Prisma
- Charts: Recharts
- Testing: Vitest (unit), Playwright (e2e)
- CI/CD: GitHub Actions
- Deployment: Vercel

---

## Architecture Overview

- Uses Next.js App Router
- Server Components for data fetching
- Route Handlers for REST APIs
- Prisma ORM for database access
- JWT-based authentication

Browser  
→ Next.js App Router  
→ Route Handlers (/api)  
→ Prisma ORM  
→ PostgreSQL (Neon)

---

## Authentication & RBAC

Authentication is implemented using NextAuth Credentials Provider.

### Roles
- admin: Full access
- staff: Read-only access
- user: Public access

### RBAC Enforcement
RBAC is enforced at 3 layers:
1. Login redirect based on role
2. Middleware protecting /admin routes
3. API layer authorization checks

---

## Features

### Products
- List products with pagination
- Create / update / delete products (admin only)
- Image upload
- Soft delete

### Orders
- View order list and details
- Update order status (admin only)

### Dashboard
- Monthly revenue
- Order count
- Order status statistics
- Charts with Recharts

---

## API Documentation

OpenAPI specification is available at:
