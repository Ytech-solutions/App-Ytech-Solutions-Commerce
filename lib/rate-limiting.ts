import rateLimit from 'express-rate-limit'
import { NextRequest, NextResponse } from 'next/server'
import { SecurityErrorHandler } from './security'

// Configuration du rate limiting selon OWASP
export const createRateLimit = (windowMs: number, max: number, message: string) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      SecurityErrorHandler.logSecurityEvent('RATE_LIMIT_EXCEEDED', {
        ip: req.ip,
        url: req.url,
        userAgent: req.get('User-Agent')
      }, 'medium')
      
      res.status(429).json({ error: message })
    }
  })
}

// Différents niveaux de rate limiting
export const rateLimits = {
  // Limite stricte pour l'authentification
  auth: createRateLimit(
    15 * 60 * 1000, // 15 minutes
    5, // 5 tentatives max
    'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.'
  ),
  
  // Limite modérée pour les formulaires
  forms: createRateLimit(
    60 * 1000, // 1 minute
    10, // 10 soumissions max
    'Trop de soumissions. Veuillez patienter.'
  ),
  
  // Limite pour les API publiques
  api: createRateLimit(
    60 * 1000, // 1 minute
    100, // 100 requêtes max
    'Limite de requêtes dépassée.'
  ),
  
  // Protection contre les attaques par force brute
  bruteForce: createRateLimit(
    60 * 60 * 1000, // 1 heure
    20, // 20 tentatives max
    'Trop de tentatives. Compte temporairement bloqué.'
  )
}

// Stockage en mémoire pour le rate limiting (à remplacer par Redis en production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function customRateLimit(
  request: NextRequest,
  windowMs: number,
  maxRequests: number
): { allowed: boolean; resetTime?: number } {
  const clientIP = request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || 
                  'unknown'
  
  const now = Date.now()
  const key = `${clientIP}:${request.nextUrl.pathname}`
  const existing = rateLimitStore.get(key)
  
  if (!existing || now > existing.resetTime) {
    // Nouvelle fenêtre de temps
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs
    })
    return { allowed: true }
  }
  
  if (existing.count >= maxRequests) {
    SecurityErrorHandler.logSecurityEvent('CUSTOM_RATE_LIMIT_EXCEEDED', {
      ip: clientIP,
      path: request.nextUrl.pathname,
      count: existing.count,
      maxRequests
    }, 'medium')
    
    return { allowed: false, resetTime: existing.resetTime }
  }
  
  existing.count++
  return { allowed: true }
}

// Middleware de rate limiting pour Next.js
export function rateLimitMiddleware(
  request: NextRequest,
  options: { windowMs: number; max: number; message?: string }
) {
  const result = customRateLimit(request, options.windowMs, options.max)
  
  if (!result.allowed) {
    return NextResponse.json(
      { 
        error: options.message || 'Limite de requêtes dépassée',
        resetTime: result.resetTime 
      },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': options.max.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': (result.resetTime || 0).toString(),
          'Retry-After': Math.ceil(((result.resetTime || 0) - Date.now()) / 1000).toString()
        }
      }
    )
  }
  
  return null
}

// Nettoyage périodique du store
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000) // Nettoyage toutes les 5 minutes
