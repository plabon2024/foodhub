
import { userService } from '@/service/user-service';
import { getSessionCookie } from 'better-auth/cookies';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy configuration for role-based access control
 * Migrated from middleware.ts (deprecated in Next.js 16+)
 * 
 * PUBLIC ROUTES (no auth required):
 * - /: Home
 * - /meals: Browse meals
 * - /meals/:id: Meal details
 * - /providers/:id: Provider details
 * - /login, /register, /verify-email: Auth pages
 * 
 * CUSTOMER ROUTES (requires CUSTOMER role):
 * - /cart: View cart
 * - /checkout: Checkout
 * - /orders: My orders
 * - /orders/:id: Order details
 * - /profile: Edit profile
 * 
 * PROVIDER ROUTES (requires PROVIDER role):
 * - /provider/dashboard: Dashboard
 * - /provider/menu: Manage meals
 * - /provider/orders: Update order status
 * - /provider/profile: Provider profile
 * 
 * ADMIN ROUTES (requires ADMIN role):
 * - /admin: Dashboard
 * - /admin/users: Manage users
 * - /admin/orders: All orders
 * - /admin/categories: Manage categories
 */
export async function proxy(request: NextRequest) {
	const pathname = request.nextUrl.pathname;

	// PUBLIC ROUTES - Allow unauthenticated access
	const publicRoutes = ['/login', '/register', '/verify-email'];
	const homeRoutes = ['/', '/meals'];
	const isPublic = 
		publicRoutes.includes(pathname) || 
		homeRoutes.includes(pathname) || 
		pathname.startsWith('/meals/') ||
		pathname.startsWith('/providers/');

	if (isPublic) {
		// Redirect authenticated users away from auth pages
		const sessionCookie = getSessionCookie(request);
		if (sessionCookie && (pathname === '/login' || pathname === '/register')) {
			return NextResponse.redirect(new URL('/', request.url));
		}
		return NextResponse.next();
	}

	// Check for session cookie (fast check)
	const sessionCookie = getSessionCookie(request);

	// All remaining routes are protected - require authentication
	if (!sessionCookie) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	// Get full user session for role-based authorization
	try {
		const { data } = await userService.getSession();
		const user = data?.user;

		if (!user) {
			return NextResponse.redirect(new URL('/login', request.url));
		}

		// CUSTOMER ROUTES: /cart, /checkout, /orders, /profile
		if (
			pathname.startsWith('/cart') ||
			pathname.startsWith('/checkout') ||
			pathname.startsWith('/orders') ||
			pathname === '/profile'
		) {
			if (user.role !== 'CUSTOMER') {
				// Redirect based on actual role
				if (user.role === 'PROVIDER') {
					return NextResponse.redirect(new URL('/provider/dashboard', request.url));
				}
				if (user.role === 'ADMIN') {
					return NextResponse.redirect(new URL('/admin', request.url));
				}
				return NextResponse.redirect(new URL('/', request.url));
			}
			return NextResponse.next();
		}

		// PROVIDER ROUTES: /provider/*
		if (pathname.startsWith('/provider')) {
			if (user.role !== 'PROVIDER') {
				// Redirect based on actual role
				if (user.role === 'ADMIN') {
					return NextResponse.redirect(new URL('/admin', request.url));
				}
				if (user.role === 'CUSTOMER') {
					return NextResponse.redirect(new URL('/', request.url));
				}
				return NextResponse.redirect(new URL('/', request.url));
			}
			return NextResponse.next();
		}

		// ADMIN ROUTES: /admin/*
		if (pathname.startsWith('/admin')) {
			if (user.role !== 'ADMIN') {
				// Redirect based on actual role
				if (user.role === 'PROVIDER') {
					return NextResponse.redirect(new URL('/provider/dashboard', request.url));
				}
				if (user.role === 'CUSTOMER') {
					return NextResponse.redirect(new URL('/', request.url));
				}
				return NextResponse.redirect(new URL('/', request.url));
			}
			return NextResponse.next();
		}

		// Default: allow if authenticated
		return NextResponse.next();
	} catch (error) {
		console.error('[Proxy] Session retrieval error:', error);
		return NextResponse.redirect(new URL('/login', request.url));
	}
}

export const config = {
	matcher: [
		// Protected customer routes
		'/cart/:path*',
		'/checkout/:path*',
		'/orders/:path*',
		'/profile',
		// Protected provider routes
		'/provider/:path*',
		// Protected admin routes
		'/admin/:path*',
		// Auth pages
		'/login',
		'/register',
		'/verify-email/:path*',
	],
};