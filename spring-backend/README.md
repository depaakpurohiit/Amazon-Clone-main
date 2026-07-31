# Trade Hive — Spring Boot Backend

The Spring Boot 3 REST API backend for Trade Hive, a full-stack e-commerce platform.

## Technology Stack

- **Java**: 21
- **Spring Boot**: 3.x
- **Database**: H2 (local file-based) / PostgreSQL-Neon (production via env vars)
- **ORM**: Hibernate / JPA
- **Security**: Spring Security + JWT (stateless, `JSESSIONID`-free)
- **Build Tool**: Maven (includes `mvnw` wrapper)
- **Admin Monitoring**: Spring Boot Admin (embedded at `/sba`)

## Project Structure

```
spring-backend/
└── src/main/java/com/example/amazonclonebackend/
    ├── config/         # DataInitializer, SchemaMigrator, application config
    ├── controller/     # REST endpoints (Admin, Seller, User, Product)
    ├── dto/            # Data transfer objects
    ├── entity/         # JPA entities (User, Product, Cart, Order, Notification, etc.)
    ├── repository/     # Spring Data JPA repositories
    ├── security/       # JWT filter, SecurityConfig
    └── service/        # Business logic (UserService, NotificationService, etc.)
```

## Database

By default, an H2 file database is used for local development:
- **Location**: `spring-backend/data/amazonclone.mv.db`
- **DDL mode**: `update` (tables are auto-created/migrated on startup)
- **H2 console**: disabled

For production, set the following environment variables to use PostgreSQL (Neon):

| Variable | Description |
|---|---|
| `DB_URL` | JDBC connection URL |
| `DB_USERNAME` | Database username |
| `DB_PASSWORD` | Database password |
| `DB_DRIVER` | JDBC driver class (e.g. `org.postgresql.Driver`) |
| `JWT_SECRET` | 32+ character secret key for JWT signing |
| `RAZORPAY_KEY_ID` | Razorpay API key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay API secret |

## API Endpoints

### Public
| Method | Path | Description |
|---|---|---|
| `GET` | `/api/products` | Get all marketplace products |
| `GET` | `/api/product/{id}` | Get single product |
| `POST` | `/api/register` | Register new user |
| `POST` | `/api/login` | Authenticate user (returns JWT cookie) |

### Authenticated (any logged-in user)
| Method | Path | Description |
|---|---|---|
| `GET` | `/api/getAuthUser` | Get current user |
| `GET` | `/api/logout` | Logout (clears JWT cookie) |
| `POST` | `/api/addtocart/{id}` | Add product to cart |
| `DELETE` | `/api/delete/{id}` | Remove item from cart |
| `PATCH` | `/api/update-qty/{id}` | Update cart item quantity |
| `POST` | `/api/create-order` | Create Razorpay payment order |
| `POST` | `/api/pay-order` | Verify and record payment |

### Seller (MANAGER role)
| Method | Path | Description |
|---|---|---|
| `GET` | `/api/seller/products` | Get seller's own products |
| `POST` | `/api/seller/products` | Create new product |
| `PUT` | `/api/seller/products/{id}` | Update own product |
| `DELETE` | `/api/seller/products/{id}` | Delete own product |
| `POST` | `/api/seller/request` | Submit seller application |

### Admin (ADMIN role)
| Method | Path | Description |
|---|---|---|
| `GET` | `/api/admin/seller-requests` | List pending seller applications |
| `POST` | `/api/admin/seller-requests/{id}/approve` | Approve seller application |
| `POST` | `/api/admin/seller-requests/{id}/reject` | Reject seller application |
| `GET` | `/api/admin/sellers` | List all sellers |
| `DELETE` | `/api/admin/sellers/{id}` | Remove seller + their products |
| `GET` | `/api/admin/products` | List all products |
| `DELETE` | `/api/admin/products/{id}` | Delete any product |
| `GET` | `/api/admin/notifications` | List all notifications |
| `DELETE` | `/api/admin/notifications` | Clear all notifications |
| `GET` | `/api/admin/live-users` | Get live session count |

## Running Locally

```bash
cd spring-backend
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8081`.

## Running Tests

```bash
./mvnw test
```

## Building for Production

```bash
./mvnw clean package
java -jar target/amazon-clone-backend-*.jar
```

## Security Notes

- JWT tokens are stored in `HttpOnly` cookies to prevent XSS access.
- Spring Boot Admin (`/sba/**`) requires HTTP Basic auth with admin credentials.
- Frame embedding of `/sba/**` is allowed from the same origin (`SAMEORIGIN`) for the embedded admin monitoring panel.
- The `notifications` table uses `VARCHAR(4000)` for the payload column for H2 compatibility.
