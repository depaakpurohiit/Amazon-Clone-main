# AGENTS.md

## Project overview
- This repo contains a full-stack e-commerce app:
  - Frontend: Next.js App Router in `frontend/`
  - Backend: Spring Boot REST API in `spring-backend/`
- The main product docs are in [README.md](README.md), [frontend/README.md](frontend/README.md), and [spring-backend/README.md](spring-backend/README.md).

## Common commands
- Install frontend dependencies from the repo root:
  - `npm run install:all`
- Frontend development and checks:
  - `cd frontend && npm run dev`
  - `cd frontend && npm run build`
  - `cd frontend && npm run lint`
- Backend development and tests:
  - `cd spring-backend && mvn spring-boot:run`
  - `cd spring-backend && mvn test`

## Architecture notes
- Frontend:
  - App routes live in `frontend/app/`.
  - Reusable UI is in `frontend/components/ui/`.
  - Auth/cart/favorites state is managed in `frontend/context/`.
  - API helpers and endpoint defaults are in `frontend/lib/api.ts`.
  - The frontend expects the backend at `http://localhost:8081` by default via `NEXT_PUBLIC_API_BASE_URL`.
- Backend:
  - Spring Boot code is under `spring-backend/src/main/java/com/example/amazonclonebackend/`.
  - Keep controller/service/repository/entity/security responsibilities separate.
  - The API is intended to remain compatible with the original frontend contract.

## Development conventions
- Prefer existing project patterns over introducing new abstractions.
- When modifying the API contract, preserve compatibility with the current frontend usage.
- Use the existing docs and current folder structure as the source of truth before making changes.
- Do not duplicate large sections of README content in new instructions; link to the docs instead.
