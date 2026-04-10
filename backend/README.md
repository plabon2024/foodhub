# foodhub-backend

## Overview
A Node.js/Express backend for FoodHub, a marketplace for users, providers, and orders. The API provides public meal browsing, user profile management, order placement, provider workflows, and admin category/user/provider-application management.

## Installation
1. Clone repository:
   ```bash
   git clone https://github.com/plabon2024/foodhub-backend.git
   cd foodhub-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure Prisma schema is generated (runs automatically on postinstall):
   ```bash
   npm run build
   ```
4. Set database connection in `.env`:
   - `DATABASE_URL` (PostgreSQL connection string)

## Usage
Start in development (uses `tsx` watch mode):
```bash
npm run dev
```

Or start the server in runtime mode:
```bash
npm start
```

Build distributable JS:
```bash
npm run build
```

Default server listens on `PORT` env or `5000`.

## Configuration
Environment variables:
- `DATABASE_URL`: Prisma database connection string (PostgreSQL).
- `PORT`: optional HTTP server port (default 5000).
- `BETTER_AUTH_SECRET`: secret key for better-auth session encryption.
- `BETTER_AUTH_URL`: authentication service URL (e.g. `http://localhost:5000`).
- `APP_URL`: frontend application URL (e.g. `http://localhost:3000`).
- `MAIL_USER`, `MAIL_PASS`: SMTP credentials for email sending.
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: Google oauth credentials (if used).

CORS origins allowed by default:
- `http://localhost:3000`
- `https://foodhub-frontend-sepia.vercel.app`

## API
Base path: `/api`

### Auth
- `GET /api/auth/me` - get current authenticated user
- `PATCH /api/auth/profile` - update current user profile

### Public Meal and Provider Routes
- `GET /api/meals` - list available meals
- `GET /api/meals/:id` - meal details
- `GET /api/providers` - list providers
- `GET /api/providers/:id` - provider with menu
- `GET /api/stats` - app statistics
- `GET /api/categories` - list categories

### Orders (requires authenticated user context)
- `POST /api/orders` - create order
- `GET /api/orders` - list current user's orders
- `GET /api/orders/:id` - order details

### Provider (provider-level) Routes
- `POST /api/provider/meals` - create meal
- `PUT /api/provider/meals/:id` - update meal
- `DELETE /api/provider/meals/:id` - delete meal
- `PATCH /api/provider/orders/:id` - update order status
- `POST /api/provider/apply` - apply for provider role

### Admin Routes
- `GET /api/admin/users` - list users
- `PATCH /api/admin/users/:id` - update user status
- `GET /api/admin/provider-applications` - list provider applications
- `POST /api/admin/provider-applications/:applicationId/approve` - approve provider application
- `POST /api/admin/categories` - create category
- `PUT /api/admin/categories/:id` - update category
- `DELETE /api/admin/categories/:id` - delete category

