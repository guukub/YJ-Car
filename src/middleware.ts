import { NextResponse } from "next/server"
import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnAdminPanel = req.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = req.nextUrl.pathname === '/admin/login';

  if (isOnAdminPanel && !isLoginPage) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/admin/login', req.nextUrl));
    }
  }

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin', req.nextUrl));
  }

  return NextResponse.next();
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
