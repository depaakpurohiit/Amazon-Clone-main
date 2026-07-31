<div align="center">
  <h1>🐝 Trade Hive</h1>
  <h3>A fully functional, modern E-commerce storefront</h3>
</div>

Trade Hive is a complete full-stack e-commerce application with a **Next.js** frontend and a **Spring Boot** backend. It supports product browsing, cart management, secure checkout, seller management, and a powerful admin panel — all running locally out of the box.

## ✨ Features

### 🛒 Customer Experience
- **User Authentication**: Secure Sign up, Sign in, and Logout via JWT.
- **Product Discovery**: Browse and search through the product catalog.
- **Shopping Cart**: Add, update, and remove items with persistent cart state.
- **Checkout & Payments**: Integrated Razorpay payment flow.
- **User Profile**: View account info, cart summary, and order history.

### 🏪 Seller Features
- **Seller Dashboard**: Manage listed products, add new ones, and view sales.
- **Product CRUD**: Full add, edit, and delete product management.
- **Marketplace Visibility**: Only active, approved sellers' products are shown on the storefront.

### 🔑 Admin Panel
- **Dashboard**: View live user counts, pending seller requests, and system notifications.
- **Seller Management**: Approve or reject seller applications; remove sellers and their listings.
- **Product Management**: View and delete any product from the marketplace.
- **Notifications**: Real-time system event log with a one-click "Clear all" button.
- **Infrastructure Metrics**: Embedded Spring Boot Admin panel for JVM health, memory, and HTTP traces.
- **Access Control**: Unauthenticated users attempting to access any `/admin/*` route are redirected to the home page.

### 🛡️ Role-Based Access Control
| Role | Landing Page | Capabilities |
|---|---|---|
| `USER` | `/` | Browse, cart, checkout, profile |
| `MANAGER` | `/seller/dashboard` | All USER + seller product management |
| `ADMIN` | `/admin/dashboard` | All + full platform administration |

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Context (Auth, Cart, Favorites)

### Backend
- **Framework**: Spring Boot 3 (Java 21)
- **Database**: H2 (file-based, local) — Neon/PostgreSQL via env vars for production
- **Security**: Spring Security + JWT
- **ORM**: Hibernate/JPA
- **Build**: Maven (includes `mvnw` wrapper)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Java 21+ and Maven (or use the included `mvnw` wrapper)

### 1. Install Dependencies

From the repo root:
```bash
npm run install:all
```

### 2. Start the Backend

```bash
cd spring-backend
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8081`.

> **Database**: By default, the backend uses a local H2 file database stored in `spring-backend/data/`. To use PostgreSQL (e.g., Neon), set `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, and `DB_DRIVER` environment variables.

### 3. Start the Frontend

Open a new terminal:
```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:3000`.

## 🔐 Default Admin Credentials

| Email | Password |
|---|---|
| `mainadmin@@1212` | `adminadmin@@` |

## 🌐 Admin Panel Routes

| Route | Description |
|---|---|
| `/admin/dashboard` | Overview + pending seller requests + notifications |
| `/admin/sellers` | List and remove approved sellers |
| `/admin/products` | View and delete all marketplace products |
| `/admin/notifications` | System event log with clear functionality |

## 🏗️ Project Structure

```
Amazon-Clone-main/
├── frontend/           # Next.js App Router frontend
│   ├── app/            # Page routes (admin/, seller/, checkout/, etc.)
│   ├── components/     # Reusable UI components
│   ├── context/        # Auth, Cart, Favorites, AdminData state
│   └── lib/            # API helpers and role utilities
└── spring-backend/     # Spring Boot REST API
    └── src/main/java/com/example/amazonclonebackend/
        ├── controller/ # REST endpoints
        ├── service/    # Business logic
        ├── repository/ # Data access (JPA)
        ├── entity/     # JPA entities
        ├── dto/        # Data transfer objects
        └── security/   # JWT & Spring Security config
```

## 📝 Notes

- The H2 database files (`spring-backend/data/`) are excluded from version control via `.gitignore`.
- The frontend proxies `/sba/**`, `/instances/**`, and `/actuator/**` to the backend for Spring Boot Admin monitoring.
- Deleting a seller from the admin panel also removes all their listed products and clears them from active carts.
- Deleting a product from the admin panel immediately removes it from the storefront.
