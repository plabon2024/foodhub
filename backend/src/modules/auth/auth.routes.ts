import { Router } from 'express';
import { checkAuth } from '../../lib/checkAuth';
import { AuthController } from './auth.controller';

const router = Router();

// POST /api/v1/auth/register
router.post('/register', AuthController.registerUser);

// POST /api/v1/auth/login
router.post('/login', AuthController.loginUser);

// GET  /api/v1/auth/me  (protected)
router.get('/me', checkAuth('CUSTOMER', 'PROVIDER', 'ADMIN'), AuthController.getMe);

// POST /api/v1/auth/refresh-token
router.post('/refresh-token', AuthController.getNewToken);

// POST /api/v1/auth/change-password  (protected)
router.post('/change-password', checkAuth('CUSTOMER', 'PROVIDER', 'ADMIN'), AuthController.changePassword);

// POST /api/v1/auth/logout  (protected)
router.post('/logout', checkAuth('CUSTOMER', 'PROVIDER', 'ADMIN'), AuthController.logoutUser);

export const authRouter = router;
