<div align="center">
  <h1>🐝 Trade Hive</h1>
  <h3>A fully functional, modern E-commerce storefront</h3>
</div>

Trade Hive is a complete e-commerce application featuring product browsing, search, shopping cart management, secure checkout flows, and user profiles. Originally built on the MERN stack, it has been migrated to a robust, production-grade Spring Boot backend.

## ✨ Features
- **User Authentication**: Secure Sign up, Sign in, and Logout using JWT.
- **Role-Based Access Control**: Dedicated dashboards and restricted routing for Customers, Sellers, and Admins.
- **Admin & Infrastructure Dashboard**: Integrated Spring Boot Admin for real-time monitoring of JVM metrics, memory usage, HTTP traces, and log level management—embedded seamlessly into the Next.js frontend via proxy.
- **Seller Verification Flow**: Customers can request seller privileges, which are held for admin review and approval.
- **Product Discovery**: Browse and search through the product catalog.
- **Shopping Cart**: Add, update, and remove items with persistent cart state.
- **Checkout & Payments**: Buy products immediately with multiple payment options (Razorpay integration).
- **Enhanced UI UX**: Polished transitions with global full-page skeleton loading screens.

## 🛠️ Technology Stack

### Frontend Client
- **Framework**: Next.js (App Router, Bloom template)
- **HTTP Client**: Axios
- **State Management**: React Context

### Backend Server (Spring Boot)
- **Framework**: Spring Boot 3 (Java 21)
- **Database**: PostgreSQL (Neon Serverless) with local H2 fallback
- **Security**: Spring Security & JWT Authentication
- **Migrations**: Flyway

*(Note: The project previously utilized an Express.js/MongoDB backend. See [MIGRATION_REPORT.md](MIGRATION_REPORT.md) for details on the transition.)*

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites
- Node.js (v18+)
- Java 21+ & Maven

### Installation & Setup

1. **Clone the repository and install dependencies:**
   From the root of the project, run:
   ```bash
   npm install
   npm run install:all
   ```

2. **Start the Backend (Spring Boot):**
   ```bash
   cd spring-backend
   mvn spring-boot:run
   ```
   *The API will be available at `http://localhost:8081/`*

   > **Database Note**: By default, the Spring backend uses a local H2 file database (`./data/amazonclone`). To use a production Neon/Postgres database, provide the `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` environment variables.

3. **Start the Frontend (Next.js):**
   Open a new terminal window and run:
   ```bash
   cd frontend
   npm run dev
   ```
   *The client will be available at `http://localhost:3000/`*

## 🌐 Demo
*Original deployment link:* [https://amazonclone-sp.herokuapp.com/](https://amazonclone-sp.herokuapp.com/)

## 📸 Screenshots

<details>
<summary>Click to view screenshots</summary>

<br>

**Home Page**
![Home Page](https://user-images.githubusercontent.com/84243683/168798477-5441dcb3-f0dc-422d-83bb-e14dee297576.png)

**Sign Up & Sign In**
![Sign Up](https://user-images.githubusercontent.com/84243683/168797684-01651633-52f3-40e9-887a-8cbca72d4491.png)
![Sign In](https://user-images.githubusercontent.com/84243683/168797547-ccbac103-eb06-49dc-a509-d61caf15603f.png)

**Product Details**
![Product](https://user-images.githubusercontent.com/84243683/168797859-25d26a38-d48c-48fa-8ff5-d21ade5621b4.png)

**Shopping Cart & Payment**
![Cart](https://user-images.githubusercontent.com/84243683/168797981-ea56d3a5-256f-4280-b75a-7fa54952c147.png)
![Payment](https://user-images.githubusercontent.com/84243683/168798064-dc774ad5-89e6-4a83-aecd-ebcf75c6cd80.png)

**User Profile & Orders**
![Profile](https://user-images.githubusercontent.com/84243683/168798275-e195649f-f0e6-4648-b96d-2c09ab6a72d5.png)
![Orders](https://user-images.githubusercontent.com/84243683/168798196-7ed1a8a0-7622-428f-a291-84d9ca92ee06.png)
</details>
