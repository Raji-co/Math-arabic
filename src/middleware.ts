import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const { pathname } = req.nextUrl;

        // Only admins can access /admin routes (contributors are blocked)
        if (pathname.startsWith('/admin') && token?.role !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }
    },
    {
        callbacks: {
            // Require auth for /admin and /dashboard
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;
                if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
                    return !!token;
                }
                return true;
            },
        },
    }
);

export const config = {
    matcher: ['/admin/:path*', '/dashboard/:path*'],
};
