# Trade Hive — Frontend

The Next.js 14 (App Router) frontend for Trade Hive, a full-stack e-commerce platform.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context API
  - `CartContext` — authentication, cart, and user state
  - `FavoritesProvider` — wishlist/favorites
  - `HomeDataProvider` — home page product data
  - `AdminDataContext` — admin dashboard data (seller requests, notifications, live users)
- **API Layer**: `lib/api.ts` — typed fetch helpers for all backend calls
- **Role Utilities**: `lib/role.ts` — role normalization and landing path helpers

## Routes

| Route | Access | Description |
|---|---|---|
| `/` | Guest + User | Storefront / product listing |
| `/login` | Guest | Login page |
| `/signup` | Guest | Registration page |
| `/cart` | Authenticated | Shopping cart |
| `/checkout` | Authenticated | Order checkout |
| `/profile` | Authenticated | User profile & account info |
| `/seller/dashboard` | MANAGER | Seller product management |
| `/seller/add` | MANAGER | Add new product |
| `/seller/edit/[id]` | MANAGER | Edit existing product |
| `/admin/dashboard` | ADMIN | Overview, seller requests, notifications |
| `/admin/sellers` | ADMIN | Seller listing + removal |
| `/admin/products` | ADMIN | Product listing + deletion |
| `/admin/notifications` | ADMIN | System notification log |

## Access Control

All protected routes are guarded by `RoleAccessGate`:
- Unauthenticated users accessing any `/admin/*` route are redirected to `/` (home).
- Unauthenticated users accessing `/seller/*` routes are redirected to `/login`.
- Logged-in `ADMIN` users are redirected away from customer-only pages.

## Getting Started

Install dependencies from the repo root:
```bash
npm run install:all
```

Run the development server:
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`. It expects the backend running at `http://localhost:8081` (configurable via `NEXT_PUBLIC_API_BASE_URL`).

## Linting & Build

```bash
npm run lint
npm run build
```
