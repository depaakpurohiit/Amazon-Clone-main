# AGENTS.md

## Project overview
- This repo contains a full-stack e-commerce marketplace ("Trade Hive"):
  - **Frontend**: Next.js App Router in `frontend/` (Bloom UI redesign, Tailwind CSS, Lucide icons).
  - **Backend**: Spring Boot REST API in `spring-backend/` (port 8081).
  - **Database**: Neon PostgreSQL cloud database (AWS us-east-1) shared between Spring Boot and Next.js serverless routes.
- Product documentation: [README.md](README.md), [frontend/README.md](frontend/README.md), and [spring-backend/README.md](spring-backend/README.md).

## Common commands
- Install dependencies from the repo root:
  - `npm run install:all`
- Frontend development and checks:
  - `npm run dev` (or `cd frontend && npm run dev`)
  - `npm run build` (or `cd frontend && npm run build`)
  - `cd frontend && npm run lint`
- Backend development and tests:
  - `cd spring-backend && ./mvnw spring-boot:run`
  - `cd spring-backend && ./mvnw test`

## Architecture & Integration Notes

### Frontend (`frontend/`)
- **Routing**: App Router located under `frontend/app/`. Includes storefront (`/`), `/shop`, `/product/[productId]`, `/cart`, `/checkout`, `/contact`, `/about`, `/privacy`, `/terms`, `/cookies`.
- **Role Gates**: Role-based access handled by `RoleAccessGate` (`customer`, `seller`, `admin`, `guest`).
  - Landing paths managed by `getRoleLandingPath()` in `frontend/lib/role.ts`.
  - Customer/User -> `/`
  - Seller/Manager -> `/seller/dashboard`
  - Admin -> `/admin/dashboard`
- **Authentication & State**:
  - Managed in `frontend/context/` (`CartContext`, `FavoritesContext`, `HomeDataContext`, `AdminDataContext`).
  - Cookie-based session (`tradehive_session`, HTTP-only, 7-day max-age) parsed by `/api/getAuthUser`.
  - Admin credentials: `mainadmin@@1212` / `adminadmin@@`.
- **API Resolution (`frontend/lib/api.ts`)**:
  - `getApiBaseUrl()` determines endpoint target dynamically:
    - On `localhost` (browser): defaults to `http://localhost:8081` with automatic fallback to Next.js routes if Spring Boot is offline.
    - On public/production domains (Vercel): defaults to same-origin relative URLs (`""`) to prevent Chrome Private Network Access (PNA) prompts and `ERR_CONNECTION_REFUSED`.
    - If `NEXT_PUBLIC_API_BASE_URL` is set to an external cloud URL (e.g. Render/Railway), it connects to that host.
- **Neon Serverless Database Access (`frontend/lib/db.ts`)**:
  - Uses `@neondatabase/serverless` over HTTP/SSL for zero-connection-overhead queries directly from Next.js serverless functions.
  - Used by `/api/products`, `/api/product/[id]`, `/api/login`, and `/api/admin/*`.
  - Fallback seed catalog of 32 products and 95 specifications synced in `frontend/data/products.json`.
- **Email Service (`frontend/lib/resend.ts`)**:
  - Integrated with Resend via `RESEND_API_KEY` for OTP verification codes in `/api/auth/send-otp`.

### Backend (`spring-backend/`)
- Spring Boot 3.x Java application under `spring-backend/src/main/java/com/example/amazonclonebackend/`.
- Layered separation: Controller -> Service -> Repository -> Entity -> Security.
- Actuator and Spring Boot Admin endpoints on `/actuator` and `/sba`.
- Database credentials loaded from `spring-backend/.env` (Neon PostgreSQL).

### Vercel Deployment Settings
- **Framework Preset**: `Next.js`
- **Root Directory**: `frontend` (or root with workspace build command)
- **Environment Variables**:
  - `RESEND_API_KEY`: Secret key for outbound OTP emails.
  - `DATABASE_URL` (optional): Override connection string for Neon PostgreSQL.
  - `NEXT_PUBLIC_API_BASE_URL` (optional): Only set if an external cloud Spring Boot backend is active.

## Development conventions
- Prefer existing project patterns over introducing new abstractions.
- Maintain compatibility with the unified API contract across both Next.js route handlers and Spring Boot controllers.
- Never commit plain-text API secrets; use environment variables.
- When adding new pages or links to layout/footer, ensure corresponding routes exist in `frontend/app/` to prevent prefetch 404s.
