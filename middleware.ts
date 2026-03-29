import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export async function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
    request.headers.get('x-real-ip') || 
    'unknown'
  
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const path = request.nextUrl.pathname

  // Add security headers
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Rate limiting
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  const maxRequests = 100
  
  const key = `${ip}:${request.nextUrl.pathname}`
  const current = rateLimitStore.get(key) || { count: 0, resetTime: now + windowMs }
  
  if (now > current.resetTime) {
    current.count = 0
    current.resetTime = now + windowMs
  }
  
  current.count++
  rateLimitStore.set(key, current)
  
  if (current.count > maxRequests) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }
  
  response.headers.set('X-RateLimit-Limit', maxRequests.toString())
  response.headers.set('X-RateLimit-Remaining', Math.max(0, maxRequests - current.count).toString())
  response.headers.set('X-RateLimit-Reset', new Date(current.resetTime).toISOString())

  // Protect dashboard routes
  if (path.startsWith('/dashboard')) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })
    
    if (!token) {
      const loginUrl = new URL('/connexion', request.url)
      loginUrl.searchParams.set('redirect', path)
      return NextResponse.redirect(loginUrl)
    }
    
    // Check admin access
    if (path.startsWith('/dashboard/admin') && token.email !== 'jadisara33@gmail.com') {
      const homeUrl = new URL('/', request.url)
      return NextResponse.redirect(homeUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
