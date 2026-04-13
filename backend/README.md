# 🔧 FoodHub — Backend

The FoodHub backend is a RESTful API built with **Express.js 5** and **TypeScript**. It handles all business logic including authentication, meal management, order processing, and role-based access control. Data is persisted in a **PostgreSQL** database via **Prisma ORM**.

---

## 📁 Folder Structure

```
backend/
├── api/
│   └── server.js               # Compiled serverless entry point (Vercel)
├── prisma/
│   ├── migrations/             # Database migration history
│   └── schema.prisma           # Prisma data model definitions
├── src/
│   ├── config/
│   │   └── index.ts            # Environment variable loader & exports
│   ├── emails/                 # Email templates (e.g., verification, notifications)
│   ├── generated/
│   │   └── prisma/             # Auto-generated Prisma client
│   ├── lib/
│   │   ├── auth.ts             # Better Auth instance configuration
│   │   ├── checkAuth.ts        # Role-based auth middleware
│   │   └── prisma.ts           # Prisma client singleton
│   ├── modules/
│   │   ├── admin/              # Admin user & category management
│   │   ├── auth/               # Authentication (register, login, tokens)
│   │   ├── category/           # Meal category CRUD
│   │   ├── meals/              # Meal listing & management
│   │   ├── orders/             # Order creation & status tracking
│   │   └── provider/           # Provider profile & application management
│   ├── types/                  # Shared TypeScript interfaces
│   ├── utils/                  # Helper utilities
│   ├── app.ts                  # Express app setup, middleware & route mounting
│   └── server.ts               # HTTP server entry point
├── .env                        # Environment variables (not committed)
├── .gitignore
├── package.json
├── prisma.config.ts            # Prisma configuration file
├── tsconfig.json
└── vercel.json                 # Vercel deployment configuration
```

---

## 🗄️ Database Schema

The PostgreSQL database is managed via **Prisma**. Key models are:

| Model                    | Description                                               |
|--------------------------|-----------------------------------------------------------|
| `User`                   | Core user with roles (`CUSTOMER`, `PROVIDER`, `ADMIN`)    |
| `Session` / `Account`    | Better Auth session & OAuth account records               |
| `ProviderProfile`        | Extended profile for food providers                       |
| `ProviderApplication`    | Customer-to-provider upgrade requests                     |
| `Category`               | Meal categories (e.g., Rice, Snacks)                      |
| `Meal`                   | Food items listed by a provider                           |
| `Order`                  | Customer orders linked to a provider                      |
| `OrderItem`              | Individual line items within an order                     |
| `Review`                 | Per-meal customer reviews with star ratings (1–5)         |

### Enums

| Enum                        | Values                                        |
|-----------------------------|-----------------------------------------------|
| `Role`                      | `CUSTOMER`, `PROVIDER`, `ADMIN`               |
| `UserStatus`                | `ACTIVE`, `SUSPENDED`                         |
| `OrderStatus`               | `PLACED`, `PREPARING`, `READY`, `DELIVERED`, `CANCELLED` |
| `ProviderApplicationStatus` | `PENDING`, `APPROVED`, `REJECTED`             |

---

## 🔑 Key Files & Their Purposes

| File                          | Purpose                                                                |
|-------------------------------|------------------------------------------------------------------------|
| `src/app.ts`                  | Configures Express app: CORS, cookie parser, middleware, all routes    |
| `src/server.ts`               | Starts the HTTP server on the configured port                          |
| `src/config/index.ts`         | Loads and exports all environment variables with type safety           |
| `src/lib/prisma.ts`           | Exports a singleton Prisma client to avoid connection pool exhaustion  |
| `src/lib/auth.ts`             | Sets up the Better Auth instance (JWT, Google OAuth, sessions)         |
| `src/lib/checkAuth.ts`        | Express middleware to verify JWT and enforce role-based access control |
| `prisma/schema.prisma`        | Single source of truth for all database models and relationships       |
| `vercel.json`                 | Routes all traffic to the compiled `api/server.js` for serverless deployment |

### Module Structure (per feature)

Each feature module under `src/modules/` follows this convention:

```
<feature>/
├── <feature>.controller.ts   # Request handlers (thin layer, calls service)
├── <feature>.service.ts      # Business logic & Prisma queries
└── <feature>.routes.ts       # Express router with route definitions
```

---

## 🌐 API Routes

| Method   | Route                             | Access              | Description                          |
|----------|-----------------------------------|---------------------|--------------------------------------|
| `POST`   | `/api/v1/auth/register`           | Public              | Register a new user                  |
| `POST`   | `/api/v1/auth/login`              | Public              | Login and receive JWT tokens         |
| `POST`   | `/api/v1/auth/logout`             | Auth                | Logout and clear cookies             |
| `GET`    | `/api/v1/auth/me`                 | Auth                | Get current authenticated user      |
| `POST`   | `/api/v1/auth/refresh-token`      | Auth                | Refresh access token                 |
| `GET`    | `/api/v1/meals`                   | Public              | List all available meals             |
| `GET`    | `/api/v1/meals/:id`               | Public              | Get a single meal by ID              |
| `POST`   | `/api/v1/provider/meals`          | Provider            | Create a new meal listing            |
| `PATCH`  | `/api/v1/provider/meals/:id`      | Provider            | Update a meal                        |
| `DELETE` | `/api/v1/provider/meals/:id`      | Provider            | Delete a meal                        |
| `POST`   | `/api/v1/provider/apply`          | Customer            | Apply to become a provider           |
| `GET`    | `/api/v1/orders`                  | Customer / Provider | Get orders for the current user      |
| `POST`   | `/api/v1/orders`                  | Customer            | Place a new order                    |
| `PATCH`  | `/api/v1/orders/:id/status`       | Provider            | Update order status                  |
| `GET`    | `/api/v1/admin/users`             | Admin               | List all users                       |
| `PATCH`  | `/api/v1/admin/users/:id/status`  | Admin               | Suspend or activate a user           |
| `GET`    | `/api/v1/admin/categories`        | Admin               | List all categories                  |
| `POST`   | `/api/v1/admin/categories`        | Admin               | Create a new category                |

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` directory:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/foodhub

# Better Auth
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:5000

# JWT
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# CORS (optional — production frontend URL)
APP_URL=https://your-frontend.vercel.app

# Email (Nodemailer)
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_email_app_password

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## 🛠️ Setup & Installation

### Prerequisites

- Node.js v20+
- npm v10+
- A running PostgreSQL database

### Steps

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Create a .env file and fill in the values above

# 4. Run Prisma migrations to set up the database schema
npx prisma migrate dev

# 5. Generate the Prisma client
npx prisma generate

# 6. Start the development server
npm run dev
```

---

## 📜 Available Scripts

| Script          | Description                                                                     |
|-----------------|---------------------------------------------------------------------------------|
| `npm run dev`   | Starts the dev server with `tsx watch` (hot reload)                             |
| `npm run start` | Alias for `npm run dev`                                                          |
| `npm run build` | Generates Prisma client and bundles the app with `tsup` for Vercel deployment   |

---

## 🚀 Deployment

The backend is configured for **serverless deployment on Vercel**.

```json
// vercel.json — rewrites all routes to the compiled handler
{
  "rewrites": [{ "source": "/(.*)", "destination": "/api/server" }]
}
```

The `npm run build` command compiles `src/server.ts` into `api/server.js` using `tsup`.
