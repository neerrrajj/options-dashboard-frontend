import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Routes that require authentication
const protectedRoutes = ['/dashboard']

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/auth']

// Get current date in IST as YYYY-MM-DD
function getISTDateString(): string {
  const now = new Date()
  const istOffset = 5.5 * 60 * 60 * 1000
  const utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000)
  const istTime = new Date(utc + istOffset)
  return istTime.toISOString().split('T')[0]
}

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)
  const { pathname } = request.nextUrl

  // Check if user is trying to access a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Check if user is trying to access auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Check session expiry by looking at the cookie
  const sessionDateCookie = request.cookies.get('auth-session-date')?.value
  const today = getISTDateString()
  const isSessionExpired = !!sessionDateCookie && sessionDateCookie !== today

  // If session is expired, consider user not authenticated
  const isAuthenticated = !!user && !isSessionExpired

  // If accessing protected route and not authenticated (or expired), redirect to auth
  if (isProtectedRoute && !isAuthenticated) {
    const authUrl = new URL('/auth', request.url)
    // Clear the expired cookie
    const response = NextResponse.redirect(authUrl)
    if (isSessionExpired) {
      response.cookies.delete('auth-session-date')
    }
    return response
  }

  // If accessing auth route and already authenticated, redirect to dashboard
  if (isAuthRoute && isAuthenticated) {
    const dashboardUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  // Set session date cookie for middleware to check
  if (user && !isSessionExpired) {
    supabaseResponse.cookies.set('auth-session-date', today, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    })
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
