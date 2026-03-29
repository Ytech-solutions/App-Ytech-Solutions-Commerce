import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token requis"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères")
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password } = resetPasswordSchema.parse(body)

    // Find valid token
    const tokenResult = await pool.query(
      `SELECT prt.user_id, prt.expires_at, u.email 
       FROM password_reset_tokens prt
       JOIN users u ON prt.user_id = u.id
       WHERE prt.token = $1 AND prt.used = FALSE AND prt.expires_at > CURRENT_TIMESTAMP`,
      [token]
    )

    if (tokenResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Token invalide ou expiré" },
        { status: 400 }
      )
    }

    const { user_id, email } = tokenResult.rows[0]

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 12)

    // Update user password
    await pool.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [passwordHash, user_id]
    )

    // Mark token as used
    await pool.query(
      'UPDATE password_reset_tokens SET used = TRUE WHERE token = $1',
      [token]
    )

    console.log(`Password reset completed successfully`)

    return NextResponse.json({
      message: "Mot de passe réinitialisé avec succès"
    })

  } catch (error) {
    console.error("Reset password error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Erreur lors de la réinitialisation du mot de passe" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json(
      { error: "Token requis" },
      { status: 400 }
    )
  }

  try {
    // Check if token is valid
    const tokenResult = await pool.query(
      `SELECT prt.expires_at, u.email 
       FROM password_reset_tokens prt
       JOIN users u ON prt.user_id = u.id
       WHERE prt.token = $1 AND prt.used = FALSE AND prt.expires_at > CURRENT_TIMESTAMP`,
      [token]
    )

    if (tokenResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Token invalide ou expiré" },
        { status: 400 }
      )
    }

    return NextResponse.json({
      valid: true,
      email: tokenResult.rows[0].email,
      expiresAt: tokenResult.rows[0].expires_at
    })

  } catch (error) {
    console.error("Validate token error:", error)
    return NextResponse.json(
      { error: "Erreur lors de la validation du token" },
      { status: 500 }
    )
  }
}
