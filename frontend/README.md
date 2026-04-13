# 🌐 FoodHub — Frontend

The FoodHub frontend is a **Next.js 16** application built with **React 19**, **TypeScript**, and **Tailwind CSS v4**. It provides three distinct interfaces: a **public storefront** for customers to browse and order meals, a **provider dashboard** for managing menus and orders, and an **admin panel** for platform administration.

---

## 📁 Folder Structure

```
frontend/
├── public/                         # Static assets (images, icons)
├── src/
│   ├── actions/
│   │   └── user.action.ts          # Server actions for user data
│   ├── app/
│   │   ├── (admin_dashboard)/      # Route group: admin panel
│   │   │   └── admin/
│   │   │       ├── categories/     # Category management page
│   │   │       ├── orders/         # Platform-wide order view
│   │   │       ├── users/          # User management page
│   │   │       ├── layout.tsx      # Admin sidebar layout
│   │   │       └── page.tsx        # Admin dashboard home (analytics)
│   │   ├── (auth)/                 # Route group: auth pages (login, register)
│   │   ├── (provider-dashboard)/   # Route group: provider panel
│   │   │   └── provider/
│   │   │       ├── dashboard/      # Provider overview page
│   │   │       ├── menu/           # Meal CRUD management
│   │   │       ├── orders/         # Provider-specific order tracking
│   │   │       ├── profile/        # Provider profile editor
│   │   │       └── layout.tsx      # Provider sidebar layout
│   │   ├── (root)/                 # Route group: public-facing storefront
│   │   │   ├── (provider)/         # Provider public detail page
│   │   │   ├── cart/               # Shopping cart page
│   │   │   ├── checkout/           # Checkout flow
│   │   │   ├── meals/              # Meal listing & detail pages
│   │   │   ├── orders/             # Customer order history
│   │   │   ├── profile/            # Customer profile page
│   │   │   ├── layout.tsx          # Public layout (navbar + footer)
│   │   │   └── page.tsx            # Home page
│   │   ├── auth/                   # Next.js Auth route handler
│   │   ├── globals.css             # Global styles & Tailwind CSS imports
│   │   ├── layout.tsx              # Root app layout (providers, fonts, meta)
│   │   └── favicon.ico
│   ├── components/
│   │   ├── auth/                   # Login, register, and auth form components
│   │   ├── imageupload/            # Reusable image upload component
│   │   ├── profile-page/           # Customer & provider profile forms
│   │   ├── providers/              # React context & TanStack Query providers
│   │   ├── shared/                 # Shared UI (navbar, footer, loaders)
│   │   ├── ui/                     # Radix UI + shadcn base components
│   │   ├── app-sidebar.tsx         # Sidebar navigation (admin & provider)
│   │   ├── chart-area-interactive.tsx # Analytics chart component
│   │   ├── data-table.tsx          # Reusable TanStack Table data table
│   │   ├── nav-main.tsx            # Main sidebar nav links
│   │   ├── nav-user.tsx            # Sidebar user menu
│   │   ├── section-cards.tsx       # Dashboard metric cards
│   │   └── site-header.tsx         # Dashboard top header bar
│   ├── hooks/
│   │   └── use-mobile.ts           # Hook to detect mobile viewport
│   ├── lib/
│   │   ├── api/                    # Axios/fetch API client functions
│   │   ├── cart/                   # Cart state management utilities
│   │   ├── auth-client.ts          # Better Auth client instance
│   │   ├── auth.ts                 # Auth helpers & session utilities
│   │   ├── jwtUtils.ts             # JWT decode/verify utilities
│   │   ├── user-context.tsx        # User context provider & hook
│   │   └── utils.ts                # General utilities (e.g., `cn` class helper)
│   ├── services/
│   │   └── auth.services.ts        # Auth service functions (login, register calls)
│   └── types/
│       └── order.ts                # TypeScript interfaces for order data
├── .env.local                      # Environment variables (not committed)
├── .gitignore
├── components.json                 # shadcn/ui component configuration
├── eslint.config.mjs               # ESLint configuration
├── next.config.ts                  # Next.js configuration (images, etc.)
├── package.json
├── postcss.config.mjs              # PostCSS configuration for Tailwind
└── tsconfig.json
```

---

## 🔑 Key Files & Their Purposes

| File / Folder                           | Purpose                                                                              |
|-----------------------------------------|--------------------------------------------------------------------------------------|
| `src/app/layout.tsx`                    | Root layout — wraps the entire app in global context providers, fonts, and metadata  |
| `src/app/(root)/page.tsx`               | Public home page with Hero, Featured Meals, Categories, and How It Works sections    |
| `src/app/(root)/layout.tsx`             | Shared layout for all public pages (navbar + footer)                                 |
| `src/app/(admin_dashboard)/admin/page.tsx` | Admin analytics dashboard with charts, metrics, and user/order summaries          |
| `src/app/(admin_dashboard)/admin/layout.tsx` | Admin sidebar layout wrapping all `/admin/*` routes                            |
| `src/app/(provider-dashboard)/provider/layout.tsx` | Provider sidebar layout wrapping all `/provider/*` routes              |
| `src/app/globals.css`                   | Global Tailwind CSS v4 tokens, custom properties, and base styles                    |
| `src/components/data-table.tsx`         | Fully-featured reusable data table (sorting, filtering, pagination) via TanStack     |
| `src/components/chart-area-interactive.tsx` | Interactive area chart for admin analytics (powered by Recharts)               |
| `src/components/app-sidebar.tsx`        | Collapsible sidebar with role-aware navigation links                                 |
| `src/lib/user-context.tsx`              | React Context that provides authenticated user state across the application          |
| `src/lib/auth-client.ts`                | Better Auth browser client for session management                                    |
| `src/lib/cart/`                         | Cart persistence logic (localStorage or state-based)                                 |
| `src/lib/api/`                          | Centralised API request functions (typed fetch wrappers for backend endpoints)       |
| `src/lib/jwtUtils.ts`                   | Client-side JWT decoding utilities                                                   |
| `src/types/order.ts`                    | Shared TypeScript types for `Order` and `OrderItem` objects                          |
| `next.config.ts`                        | Next.js configuration — image domain allow-listing, environment settings             |
| `components.json`                       | shadcn/ui configuration (component paths, CSS variables, icon library)               |

---

## 🗂️ Application Routes

### Public (Customer) — `(root)` Route Group

| Route            | Description                                           |
|------------------|-------------------------------------------------------|
| `/`              | Home page — Hero, Featured Meals, Categories, CTA     |
| `/meals`         | Browse all available meals                            |
| `/meals/[id]`    | Meal detail page                                      |
| `/cart`          | Shopping cart                                         |
| `/checkout`      | Order checkout form & confirmation                    |
| `/orders`        | Customer order history & tracking                     |
| `/profile`       | Customer profile settings                             |

### Auth — `(auth)` Route Group

| Route            | Description              |
|------------------|--------------------------|
| `/login`         | User login page           |
| `/register`      | User registration page    |

### Provider Dashboard — `(provider-dashboard)` Route Group

| Route                    | Description                               |
|--------------------------|-------------------------------------------|
| `/provider/dashboard`    | Provider stats and overview               |
| `/provider/menu`         | Add, edit, and delete meal listings       |
| `/provider/orders`       | View and update status of incoming orders |
| `/provider/profile`      | Edit provider profile (name, phone, etc.) |

### Admin Panel — `(admin_dashboard)` Route Group

| Route                    | Description                                         |
|--------------------------|-----------------------------------------------------|
| `/admin`                 | Admin home with analytics charts and summary cards  |
| `/admin/users`           | View, suspend, and manage all users                 |
| `/admin/orders`          | View all orders across the platform                 |
| `/admin/categories`      | Create and manage meal categories                   |

---

## 📦 Key Dependencies

| Package                       | Purpose                                               |
|-------------------------------|-------------------------------------------------------|
| `next` v16                    | React framework with App Router, SSR, and SSG         |
| `react` v19                   | UI library                                            |
| `tailwindcss` v4              | Utility-first CSS framework                           |
| `better-auth`                 | Authentication (session management, OAuth)            |
| `@tanstack/react-query`       | Server state management & data fetching               |
| `@tanstack/react-table`       | Headless data table with sorting, filtering           |
| `@tanstack/react-form`        | Form state management with validation                 |
| `recharts`                    | Chart library for admin analytics                     |
| `zod`                         | Schema validation for forms and API responses         |
| `sonner`                      | Toast notifications                                   |
| `lucide-react`                | Icon library                                          |
| `@radix-ui/*`                 | Accessible headless UI primitives (tabs, switch, etc.)|
| `@dnd-kit/*`                  | Drag-and-drop functionality                           |
| `next-themes`                 | Dark / light theme support                            |
| `date-fns`                    | Date formatting utilities                             |

---

## ⚙️ Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```env
# Backend API base URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# Better Auth
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:5000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## 🛠️ Setup & Installation

### Prerequisites

- Node.js v20+
- npm v10+
- The backend server must be running (see [backend/README.md](../backend/README.md))

### Steps

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Create .env.local and fill in the values above

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## 📜 Available Scripts

| Script         | Description                                                  |
|----------------|--------------------------------------------------------------|
| `npm run dev`  | Starts the Next.js development server with hot reload         |
| `npm run build`| Creates an optimised production build                        |
| `npm run start`| Runs the production build locally                            |
| `npm run lint` | Runs ESLint to check for code quality issues                 |

---

## 🎨 Design System

- **Framework**: Tailwind CSS v4 with custom CSS variables defined in `globals.css`
- **Components**: Built on top of **Radix UI** primitives, configured via `components.json` (shadcn/ui convention)
- **Theming**: Light/dark mode support with `next-themes`
- **Typography**: System font stack — override in `globals.css` as needed
- **Icons**: `lucide-react` and `@tabler/icons-react`
