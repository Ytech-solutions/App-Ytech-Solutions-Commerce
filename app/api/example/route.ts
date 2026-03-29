import { NextRequest, NextResponse } from 'next/server'
import { apiSecurityMiddleware } from '@/lib/api-security'

// Exemple d'implémentation pour une route API sécurisée
export async function POST(request: NextRequest) {
  // 1. Vérification de sécurité
  const securityCheck = await apiSecurityMiddleware(request)
  if (securityCheck) {
    return securityCheck
  }

  try {
    // 2. Traitement de la requête
    const body = await request.json()
    
    // 3. Logique métier ici...
    
    return NextResponse.json(
      { success: true, message: 'Opération réussie' },
      { status: 200 }
    )
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // 1. Vérification de sécurité
  const securityCheck = await apiSecurityMiddleware(request)
  if (securityCheck) {
    return securityCheck
  }

  try {
    // Logique GET ici...
    
    return NextResponse.json(
      { data: 'Données sécurisées' },
      { status: 200 }
    )
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
