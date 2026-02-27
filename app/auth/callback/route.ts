import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.session) {
      // Create response with redirect to /dashboard (no query params)
      const response = NextResponse.redirect(`${origin}/dashboard`)
      
      // Set session date cookie for middleware
      const now = new Date()
      const istOffset = 5.5 * 60 * 60 * 1000
      const utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000)
      const istTime = new Date(utc + istOffset)
      const today = istTime.toISOString().split('T')[0]
      
      response.cookies.set('auth-session-date', today, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
      })
      
      return response
    }
  }

  // Return the user to the auth page if there was an error
  return NextResponse.redirect(`${origin}/auth?error=auth_callback_failed`)
}
