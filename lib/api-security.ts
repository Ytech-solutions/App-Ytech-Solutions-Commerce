import { NextRequest, NextResponse } from 'next/server'
import { rateLimitMiddleware } from './rate-limiting'
import { SecurityErrorHandler } from './security'

type MiddlewareResult = NextResponse | null

function getClientIp(request: NextRequest) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

function rejectJsonIfNotJson(request: NextRequest): MiddlewareResult {
  // Accept empty content-type for GET/HEAD; enforce JSON for POST/PUT/PATCH where body is expected.
  const method = request.method.toUpperCase()
  if (!['POST', 'PUT', 'PATCH'].includes(method)) return null

  const contentType = request.headers.get('content-type') || ''
  if (!contentType.toLowerCase().includes('application/json')) {
    SecurityErrorHandler.logSecurityEvent(
      'INVALID_CONTENT_TYPE',
      { method, path: request.nextUrl.pathname, contentType, ip: getClientIp(request) },
      'medium'
    )
    return NextResponse.json(
      { error: 'Content-Type doit être application/json' },
      { status: 415 }
    )
  }
  return null
}

function setApiResponseHeaders(response: NextResponse) {
  response.headers.set('Cache-Control', 'no-store')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()')
  return response
}

export async function apiSecurityMiddleware(request: NextRequest): Promise<MiddlewareResult> {
  const contentTypeCheck = rejectJsonIfNotJson(request)
  if (contentTypeCheck) return setApiResponseHeaders(contentTypeCheck)

  const rateLimit = rateLimitMiddleware(request, {
    windowMs: 60 * 1000,
    max: 100,
    message: 'Limite de requêtes dépassée.'
  })
  if (rateLimit) return setApiResponseHeaders(rateLimit)

  return null
}

export async function contactSecurityMiddleware(request: NextRequest): Promise<MiddlewareResult> {
  const contentTypeCheck = rejectJsonIfNotJson(request)
  if (contentTypeCheck) return setApiResponseHeaders(contentTypeCheck)

  const rateLimit = rateLimitMiddleware(request, {
    windowMs: 60 * 1000,
    max: 10,
    message: 'Trop de soumissions. Veuillez patienter.'
  })
  if (rateLimit) return setApiResponseHeaders(rateLimit)

  return null
}

export async function authSecurityMiddleware(request: NextRequest): Promise<MiddlewareResult> {
  const contentTypeCheck = rejectJsonIfNotJson(request)
  if (contentTypeCheck) return setApiResponseHeaders(contentTypeCheck)

  const rateLimit = rateLimitMiddleware(request, {
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.'
  })
  if (rateLimit) return setApiResponseHeaders(rateLimit)

  return null
}

