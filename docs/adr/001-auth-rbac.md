# ADR-001: Authentication & Role-Based Access Control (RBAC)

## Status
Accepted

---

## Context
The Mini Admin Dashboard requires authentication and role-based access control
to separate permissions between administrators and staff users.

The system needs:
- Secure authentication
- Admin-only access to management features
- Read-only access for staff users
- Compatibility with Next.js App Router

---

## Decision
We use **NextAuth** with **Credentials Provider** and **JWT-based sessions**
to handle authentication.

Role-based access control (RBAC) is implemented with three roles:
- **admin**
- **staff**
- **user**

---

## RBAC Enforcement Strategy

RBAC is enforced at **three layers**:

### 1. Login Redirect
After successful login, users are redirected based on their role:
- Admin → `/admin/dashboard`
- Staff/User → `/products`

### 2. Middleware Protection
Next.js middleware protects all `/admin/*` routes.
Only users with the `admin` role can access these routes.

### 3. API Authorization
All mutation APIs (create, update, delete) require admin privileges.
Authorization is checked on the server using session validation.

---

## Reasons
- NextAuth integrates well with Next.js App Router
- JWT sessions work efficiently with middleware
- Clear separation of responsibilities
- Simple and maintainable RBAC logic

---

## Consequences
- Admin routes and APIs are secure by default
- Staff users have safe read-only access
- RBAC logic is centralized and easy to extend
- Slight increase in initial setup complexity

---

## Future Considerations
- Add more granular permissions if needed
- Integrate OAuth providers if required
- Improve audit logging for admin actions
