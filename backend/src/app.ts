import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";

import { adminRoutes } from "./modules/admin/admin.routes";
import { authRouter } from "./modules/auth/auth.routes";
import { mealRoutes } from "./modules/meals/meals.routes";
import { orderRoutes } from "./modules/orders/orders.routes";
import { providerRoutes } from "./modules/provider/provider.routes";
import { checkAuth } from "./lib/checkAuth";
import envVars from "./config";

export const app: Application = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://foodhub-frontend-sepia.vercel.app",
  ...(envVars.APP_URL ? [envVars.APP_URL] : []),
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ["Set-Cookie"],

};

app.use(cors(corsOptions));
app.options("/*splat", cors(corsOptions)); // Pre-flight for all routes
app.use(cookieParser());
app.use(express.json());

// Auth routes (login, register, logout, me, refresh-token, change-password)
app.use("/api/v1/auth", authRouter);

// Meals & Providers (Public)
app.use("/api/v1", mealRoutes);

// Provider Management (Protected)
app.use("/api/v1/provider", checkAuth("PROVIDER"), providerRoutes);

// Orders (Protected - usually needs auth, but keeping structure)
app.use("/api/v1/orders", checkAuth("CUSTOMER", "PROVIDER", "ADMIN"), orderRoutes);

// Admin routes (Protected)
app.use("/api/v1/admin", checkAuth("ADMIN"), adminRoutes);

app.get("/", (req, res) => {
  res.send("hello world");
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    if (statusCode >= 500) {
        console.error('API Error:', err);
    } else {
        console.warn(`API Warning [${req.method} ${req.originalUrl}]: ${statusCode} - ${message}`);
    }

    res.status(statusCode).json({
        success: false,
        message,
        stack: envVars.NODE_ENV === 'development' ? err.stack : undefined,
    });
});
