// src/types/index.d.ts
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
      };
    }
  }
}

export {};
