# <div align="center">Trade Hive</div>

### <div align="center">A fully functional E-commerce website</div><br>

Trade Hive is a modern e-commerce storefront with browsing, search, cart, and checkout flows. Customers can browse products and make purchases, with sign in/sign up and cart persistence.

## Backend Options 🚀

### Original MERN Backend
Built with Node.js, Express.js, and MongoDB.

### Spring Boot Backend (Migration)
A production-grade Spring Boot backend with PostgreSQL database.
- **Location**: `spring-backend/` folder
- **Technology**: Java 21, Spring Boot 3, PostgreSQL, JWT Authentication
- **Features**: All original functionality with improved architecture, security, and performance

## Features 📃
<ul>
  <li>User Sign up / Sign in</li>
  <li>Logout from your account</li>
  <li>Browse and search products</li>
  <li>Check profile and order history</li>
  <li>Cart:</li>
  <ul>
    <li>Add multiple products</li>
    <li>Update products</li>
    <li>Remove products</li>
  </ul>
  <li>Buy a product immediately</li>
  <li>Payment with multiple options</li>
</ul>

## Technology Used 💻
<ul>
  <li><strong>IDE:</strong> Visual Studio Code</li>
  <li><strong>Frontend:</strong> Next.js (Bloom template)</li>
  <li><strong>Backend:</strong> Express.js</li>
  <li><strong>Database:</strong> MongoDB</li>
  <li><strong>Runtime Environment:</strong> Node.js</li>
  <li><strong>HTTP Client:</strong> Axios</li>
  <li><strong>Version Control:</strong> Git</li>
  <li><strong>Payment Integration:</strong> Razorpay</li>
</ul>

## Demo Link 🌐
https://amazonclone-sp.herokuapp.com/

## Download Files 👇
* Go to my GitHub repository: https://github.com/SushantPatial/Amazon-Clone
* Download zip or clone repository
* Then open the folder in your IDE 

## To start the server 👨‍💻

### MERN Backend (Original)
```shell
cd backend
npm install
nodemon
```
The server is now running at http://localhost:8000/

### Spring Boot Backend (Migration)
```shell
cd spring-backend
mvn spring-boot:run
```
The server is now running at http://localhost:8081/

**Note**: The Spring Boot backend now expects Neon/Postgres via `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DRIVER`, and `DB_DIALECT`. See `spring-backend/README.md` for the production-safe configuration and test-only H2 notes.

## To start both (from project root)
```shell
npm install
npm run install:all
```
Then start the pieces separately:
- Spring backend: `cd spring-backend` then `mvn spring-boot:run` (http://localhost:8081/)
- Frontend: `cd frontend` then `npm start` (http://localhost:3000/)


## To start the client 👩‍💻
```shell
cd frontend
npm install
npm start
```
The client is now running at http://localhost:3000/ 

## Screenshots 😍

#### Home Page
![image](https://user-images.githubusercontent.com/84243683/168798477-5441dcb3-f0dc-422d-83bb-e14dee297576.png)

#### Sign Up
![image](https://user-images.githubusercontent.com/84243683/168797684-01651633-52f3-40e9-887a-8cbca72d4491.png)

#### Sign In
![image](https://user-images.githubusercontent.com/84243683/168797547-ccbac103-eb06-49dc-a509-d61caf15603f.png)

#### Product
![image](https://user-images.githubusercontent.com/84243683/168797859-25d26a38-d48c-48fa-8ff5-d21ade5621b4.png)

#### Cart
![image](https://user-images.githubusercontent.com/84243683/168797981-ea56d3a5-256f-4280-b75a-7fa54952c147.png)

#### Payment
![image](https://user-images.githubusercontent.com/84243683/168798064-dc774ad5-89e6-4a83-aecd-ebcf75c6cd80.png)

#### Profile
![image](https://user-images.githubusercontent.com/84243683/168798275-e195649f-f0e6-4648-b96d-2c09ab6a72d5.png)

#### Orders
![image](https://user-images.githubusercontent.com/84243683/168798196-7ed1a8a0-7622-428f-a291-84d9ca92ee06.png)
