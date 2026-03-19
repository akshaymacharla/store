# 🛒 ShopNova — Production-Grade E-Commerce Platform

[![CI/CD](https://github.com/akshaymacharla/store/actions/workflows/main.yml/badge.svg)](https://github.com/akshaymacharla/store/actions)
[![Java](https://img.shields.io/badge/Java-17-orange?logo=java)](https://openjdk.org/projects/jdk/17/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?logo=spring)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue?logo=docker)](https://docs.docker.com/compose/)

> A full-stack, scalable e-commerce platform built with Java Spring Boot and React (Vite + Tailwind CSS). Features JWT authentication, role-based access, advanced product search, order management, and a stunning dark-themed UI.

---

## 📸 Screenshots

| Home Page | Shop Page | Admin Dashboard |
|:---------:|:---------:|:---------------:|
| ![Home](./docs/screenshot-home.png) | ![Shop](./docs/screenshot-shop.png) | ![Admin](./docs/screenshot-admin.png) |

---

## ✨ Features

### Backend (Spring Boot)
- 🔐 **JWT Authentication** — Stateless auth with role-based access (USER / ADMIN)
- 🔍 **Advanced Product Search** — Keyword, category, price range, availability filters with pagination & sorting
- 🛒 **Order Management** — Place orders, track history, order items breakdown
- 💳 **Mock Payment Service** — Simulates Stripe test mode (`tok_visa` / `tok_fail`)
- ❤️ **Wishlist API** — Add/remove per user
- 🗂️ **Category Management** — Normalized relational DB schema
- 📋 **Global Exception Handling** — `@ControllerAdvice` with structured error responses
- 📊 **Spring Boot Actuator** — Health, info, and metrics endpoints
- 📄 **Swagger / OpenAPI UI** — Interactive API docs at `/swagger-ui.html`
- 🗃️ **MapStruct DTOs** — Clean API contracts, no entity exposure

### Frontend (React + Vite)
- 🎨 **Dark Glassmorphism Design** — Premium feel with Tailwind CSS utility classes
- ⚡ **Zustand State Management** — Auth, cart, products — with `localStorage` persistence
- 🔎 **Debounced Search** — Real-time search without API flooding
- 🧩 **Code Splitting** — `React.lazy()` for all route pages
- 🎞️ **Framer Motion Animations** — Page transitions, cart badge, modals
- 🔔 **React Hot Toast** — Elegant toast notifications
- 👤 **Protected Routes** — Authenticated and admin-only routes
- 🛠️ **Admin Dashboard** — Product stats, CRUD table

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Java 17, Spring Boot 3, Spring Security, JPA/Hibernate |
| **Auth** | JWT (JJWT 0.11.5), BCrypt |
| **Database** | H2 (dev) / MySQL 8 (prod) |
| **Mapping** | MapStruct |
| **Docs** | springdoc-openapi (Swagger UI) |
| **Frontend** | React 18, Vite, Tailwind CSS 3 |
| **State** | Zustand + localStorage persist |
| **Animations** | Framer Motion |
| **HTTP Client** | Axios |
| **DevOps** | Docker, Docker Compose, GitHub Actions |

---

## 🚀 Quick Start

### Option 1 — Local Development (recommended)

```bash
# Clone the repo
git clone https://github.com/akshaymacharla/store.git
cd store

# Backend (Java 17 required)
cd ecom-backend/apple-main/ecom-project
./mvnw spring-boot:run
# → http://localhost:8080
# → Swagger UI: http://localhost:8080/swagger-ui.html
# → H2 Console: http://localhost:8080/h2-console (JDBC: jdbc:h2:mem:ecomdb)

# Frontend (Node 20 required)
cd ecom-frontend/ecom-frontend-5-main
npm install
npm run dev
# → http://localhost:5173
```

### Option 2 — Docker Compose (production-like)

```bash
# Copy and configure environment
cp .env.example .env
# Edit .env with your credentials

# Build and start all services (MySQL + Backend + Frontend)
docker compose up --build

# → Frontend: http://localhost
# → Backend API: http://localhost:8080
# → Swagger UI: http://localhost:8080/swagger-ui.html
```

---

## 🔑 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user |
| `POST` | `/api/auth/login` | Public | Login, get JWT |
| `GET` | `/api/products` | Public | List all products |
| `GET` | `/api/products/search` | Public | Search with filters |
| `POST` | `/api/product` | Admin | Add product |
| `PUT` | `/api/product/{id}` | Admin | Update product |
| `DELETE` | `/api/product/{id}` | Admin | Delete product |
| `GET` | `/api/wishlist/{userId}` | Auth | Get wishlist |
| `POST` | `/api/wishlist/{userId}/add/{productId}` | Auth | Add to wishlist |
| `DELETE` | `/api/wishlist/{userId}/remove/{productId}` | Auth | Remove from wishlist |
| `POST` | `/api/orders` | Auth | Place order |
| `GET` | `/api/orders/user/{userId}` | Auth | Order history |
| `GET` | `/actuator/health` | Public | Health check |

> **Full interactive docs** → Open `/swagger-ui.html` when the backend is running.

---

## 🧪 Mock Payment

Use these test tokens in the Checkout page:

| Token | Result |
|---|---|
| `tok_visa` | ✅ Payment succeeds |
| `tok_fail` | ❌ Payment declined |

---

## 🔧 Environment Variables

```bash
# Database
DB_USERNAME=ecomuser
DB_PASSWORD=ecompassword

# JWT (use a strong 64+ char secret in production)
JWT_SECRET=your_very_long_secret_key_here

# Frontend API URL
VITE_API_URL=http://localhost:8080
```

---

## 📁 Project Structure

```
store/
├── .github/workflows/main.yml       # CI/CD pipeline
├── docker-compose.yml               # Full stack orchestration
├── .env.example                     # Environment template
│
├── ecom-backend/
│   └── apple-main/ecom-project/
│       ├── src/main/java/com/akshay/ecom_project/
│       │   ├── config/              # Security, Swagger config
│       │   ├── controller/          # REST controllers
│       │   ├── dto/                 # Data Transfer Objects
│       │   ├── exception/           # Global exception handling
│       │   ├── mapper/              # MapStruct mappers
│       │   ├── model/               # JPA Entities
│       │   ├── repo/                # Spring Data repos
│       │   ├── security/            # JWT filter & user details
│       │   └── service/             # Business logic
│       └── Dockerfile
│
└── ecom-frontend/
    └── ecom-frontend-5-main/
        ├── src/
        │   ├── pages/               # Route-level components
        │   ├── components/          # Shared components (Navbar)
        │   ├── store/               # Zustand state stores
        │   └── axios.jsx            # Configured Axios instance
        ├── nginx.conf               # Production Nginx config
        └── Dockerfile
```

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## 📄 License

MIT © Akshay Macharla
