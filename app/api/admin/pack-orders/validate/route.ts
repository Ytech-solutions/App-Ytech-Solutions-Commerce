import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import pool from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    // Vérifier que l'utilisateur est authentifié et admin
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json(
        { error: 'ID de commande requis' },
        { status: 400 }
      )
    }

    // Valider la commande
    await pool.query(
      'UPDATE pack_orders SET is_validated = TRUE, validated_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [orderId]
    )

    return NextResponse.json(
      { 
        success: true,
        message: 'Commande validée avec succès'
      }
    )

  } catch (error) {
    console.error('Erreur lors de la validation de la commande:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
