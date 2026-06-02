# Amazon Clone Backend - Spring Boot Migration

This is a production-grade Spring Boot backend migrated from a MERN stack application.

## Technology Stack

- **Java**: 21
- **Spring Boot**: 3.2.0
- **Database**: PostgreSQL
- **ORM**: Hibernate/JPA
- **Security**: Spring Security + JWT
- **Build Tool**: Maven
- **Documentation**: OpenAPI/Swagger

## Features

- User registration and authentication with JWT
- Product catalog management
- Shopping cart functionality
- Order processing with Razorpay integration
- PostgreSQL database with normalized schema
- RESTful API design
- Input validation and error handling
- CORS configuration

## Project Structure

```
spring-backend/
├── src/main/java/com/example/amazonclonebackend/
│   ├── controller/          # REST controllers
│   ├── service/            # Business logic layer
│   ├── repository/         # Data access layer
│   ├── entity/             # JPA entities
│   ├── dto/                # Data transfer objects
│   ├── security/           # Security configuration
│   ├── config/             # Application configuration
│   ├── exception/          # Exception handling
│   └── util/               # Utility classes
├── src/main/resources/
│   └── application.properties
├── pom.xml
├── schema.sql
└── README.md
```

## Database Schema

The application uses a normalized PostgreSQL schema with the following main tables:

- `products` - Product catalog
- `product_points` - Product feature points
- `users` - User accounts
- `user_tokens` - JWT tokens
- `cart_items` - Shopping cart items
- `orders` - Order records
- `order_products` - Order line items

## API Endpoints

### Public Endpoints
- `GET /api/products` - Get all products
- `GET /api/product/{id}` - Get product by ID
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Protected Endpoints
- `POST /api/addtocart/{id}` - Add item to cart
- `DELETE /api/delete/{id}` - Remove item from cart
- `PATCH /api/update-qty/{id}` - Update cart item quantity
- `GET /api/getAuthUser` - Get authenticated user
- `GET /api/logout` - Logout user
- `GET /api/get-razorpay-key` - Get Razorpay key
- `POST /api/create-order` - Create payment order
- `POST /api/pay-order` - Process payment

## Setup Instructions

### Prerequisites
- Java 21
- PostgreSQL
- Maven

### Database Setup
1. Create a PostgreSQL database named `amazon_clone`
2. Run the schema.sql file to create tables
3. Update application.properties with your database credentials

### Environment Variables
Create a `.env` file or set environment variables:
```
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
JWT_SECRET=your_32+_character_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### Running the Application
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8081`

Note: the runtime configuration expects Neon/Postgres through the `DB_*` env vars shown above. H2 is now limited to test-only usage under `src/test/resources/application.properties`.

## Migration Notes

### From MERN to Spring Boot
1. **Database**: MongoDB collections → PostgreSQL normalized tables
2. **Authentication**: Express middleware → Spring Security + JWT
3. **Validation**: express-validator → Jakarta Validation
4. **Business Logic**: Inline controller logic → Service layer
5. **Error Handling**: Try-catch blocks → Global exception handler
6. **CORS**: cors middleware → Spring CORS configuration

### Key Changes
- Embedded documents normalized into separate tables
- UUIDs used for primary keys
- BCrypt password encoding
- Proper HTTP status codes
- DTO pattern for API responses
- Constructor injection for dependencies

## Testing

Run tests with:
```bash
mvn test
```

## Deployment

Build for production:
```bash
mvn clean package
java -jar target/amazon-clone-backend-0.0.1-SNAPSHOT.jar
```

## API Compatibility

This Spring Boot backend maintains full API compatibility with the original MERN frontend. All endpoints return the same response formats and handle the same request structures.
