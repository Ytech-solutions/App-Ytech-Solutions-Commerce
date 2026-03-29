import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import crypto from 'crypto'
import { z } from 'zod'
import nodemailer from 'nodemailer'

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

const forgotPasswordSchema = z.object({
  email: z.string().email("Email invalide")
})

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const sendResetEmail = async (email: string, name: string, resetLink: string) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Réinitialisation de votre mot de passe - Ytech Solutions',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; color: white; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Ytech Solutions</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Réinitialisation de mot de passe</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin: 20px 0;">
          <h2 style="color: #333; margin: 0 0 20px 0;">Bonjour ${name},</h2>
          
          <p style="color: #666; line-height: 1.6; margin: 0 0 30px 0;">
            Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      font-weight: bold;
                      display: inline-block;
                      box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11);">
              Réinitialiser mon mot de passe
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; line-height: 1.6; margin: 0;">
            Ce lien expirera dans 1 heure. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
          </p>
        </div>
        
        <div style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
          <p>Cet email a été envoyé automatiquement. Ne répondez pas à cet email.</p>
          <p>© 2024 Ytech Solutions. Tous droits réservés.</p>
        </div>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`Email sent successfully to ${email}`)
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = forgotPasswordSchema.parse(body)

    // Check if user exists
    const userResult = await pool.query(
      'SELECT id, name, email FROM users WHERE email = $1 AND provider = $2',
      [email, 'email']
    )

    if (userResult.rows.length === 0) {
      // Don't reveal if email exists or not for security
      return NextResponse.json({
        message: "Si cet email existe, un lien de réinitialisation sera envoyé"
      })
    }

    const user = userResult.rows[0]

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 3600000) // 1 hour from now

    // Save token to database
    await pool.query(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at) 
       VALUES ($1, $2, $3)`,
      [user.id, token, expiresAt]
    )

    // Create reset link
    const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${token}`

    // Send real email
    const emailSent = await sendResetEmail(user.email, user.name, resetLink)
    
    if (!emailSent) {
      console.error('Failed to send password reset email')
      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'email" },
        { status: 500 }
      )
    }

    console.log(`Password reset email sent successfully to user ID: ${user.id}`)
    return NextResponse.json({
      message: "Si cet email existe, un lien de réinitialisation sera envoyé"
    })

  } catch (error) {
    console.error("Forgot password error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Erreur lors de la demande de réinitialisation" },
      { status: 500 }
    )
  }
}
