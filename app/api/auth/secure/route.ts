import { NextRequest, NextResponse } from 'next/server'
import { authSecurityMiddleware } from '@/lib/api-security'
import { getToken } from 'next-auth/jwt'

export async function POST(request: NextRequest) {
  // 1. Vérification de sécurité pour l'authentification
  const securityCheck = await authSecurityMiddleware(request)
  if (securityCheck) {
    return securityCheck
  }

  try {
    const { email, password } = await request.json()

    // 2. Validation supplémentaire si nécessaire
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    // 3. Logique d'authentification existante...
    // (Intégrer avec votre système d'auth existant)

    return NextResponse.json(
      { success: true, message: 'Connexion réussie' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Auth Error:', error)
    return NextResponse.json(
      { error: 'Erreur de connexion' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Vérification du token pour les routes protégées
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  })

  if (!token) {
    return NextResponse.json(
      { error: 'Non autorisé' },
      { status: 401 }
    )
  }

  return NextResponse.json(
    { user: token },
    { status: 200 }
  )
}
