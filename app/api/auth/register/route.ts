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

const registerSchema = z.object({
  prenom: z.string().min(1, "Prénom requis"),
  name: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères")
})

export async function POST(request: NextRequest) {
  try {
    const startTime = Date.now()
    
    const body = await request.json()
    const { prenom, name, email, password } = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user
    await pool.query(
      `INSERT INTO users (prenom, name, email, password_hash, provider, email_verified, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)`,
      [prenom, name, email, passwordHash, 'email', false]
    )

    const endTime = Date.now()
    console.log(`User registered successfully in ${endTime - startTime}ms`)

    return NextResponse.json({
      message: "Inscription réussie",
      user: { prenom, name, email }
    })

  } catch (error) {
    console.error("Register error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Erreur lors de l'inscription" },
      { status: 500 }
    )
  }
}
