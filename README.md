# 🍽️ FoodHub

FoodHub is a full-stack food ordering platform that connects customers with food providers. Customers can browse meals by category, add items to their cart, and place orders. Providers manage their menus and track incoming orders through a dedicated dashboard. Admins oversee users, categories, and platform activity via an admin panel.

---

## 📁 Project Structure

```
foodhub/
├── backend/        # Express.js REST API with Prisma ORM (TypeScript)
├── frontend/       # Next.js 16 web application (TypeScript + Tailwind CSS)
└── README.md       # This file
```

---

## 🏗️ Architecture Overview

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | Next.js 16, React 19, Tailwind CSS v4   |
| Backend    | Express.js 5, TypeScript, Prisma ORM   |
| Database   | PostgreSQL                              |
| Auth       | Better Auth (JWT + Cookie-based)        |
| ORM        | Prisma (with PostgreSQL adapter)        |
| Deployment | Vercel (both frontend & backend)        |

---

## 👥 User Roles

| Role       | Capabilities                                                        |
|------------|---------------------------------------------------------------------|
| `CUSTOMER` | Browse meals, manage cart, place orders, track order status         |
| `PROVIDER` | Manage meal listings, view & update orders, manage profile          |
| `ADMIN`    | Manage users, categories, view all orders, approve provider applications |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v20 or later
- **npm** v10 or later
- A running **PostgreSQL** database instance

### 1. Clone the Repository

```bash
git clone <repository-url>
cd foodhub
```

### 2. Set Up the Backend

```bash
cd backend
npm install
# Configure environment variables (see backend/README.md)
npm run dev
```

### 3. Set Up the Frontend

```bash
cd frontend
npm install
# Configure environment variables (see frontend/README.md)
npm run dev
```

The frontend will be available at `http://localhost:3000` and the backend API at `http://localhost:5000`.

---

## 📄 Documentation

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)

---

## 📝 License

This project is developed as part of an academic assignment (B6A4).
