import { NextRequest, NextResponse } from 'next/server'
import { contactSecurityMiddleware } from '@/lib/api-security'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  // 1. Vérification de sécurité pour le formulaire de contact
  const securityCheck = await contactSecurityMiddleware(request)
  if (securityCheck) {
    return securityCheck
  }

  try {
    const { name, email, message, phone } = await request.json()

    // 2. Validation supplémentaire
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      )
    }

    // 3. Configuration du transporteur email (sécurisé)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true', // true pour 465, false pour autres ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: true // Validation du certificat
      }
    })

    // 4. Email de notification (admin)
    const adminEmail = {
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL || 'contact@ytech-solutions.com',
      subject: `📧 Nouveau message de ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            Nouveau message de contact
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Nom :</strong> ${name}</p>
            <p><strong>Email :</strong> <a href="mailto:${email}">${email}</a></p>
            ${phone ? `<p><strong>Téléphone :</strong> ${phone}</p>` : ''}
            <p><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
          </div>
          
          <div style="background: white; padding: 20px; border-left: 4px solid #007bff; margin: 20px 0;">
            <h3 style="margin-top: 0;">Message :</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
            <p>Cet email a été envoyé depuis le formulaire de contact sécurisé de Ytech Solutions</p>
            <p>Adresse IP : ${request.headers.get('x-forwarded-for') || 'Inconnue'}</p>
          </div>
        </div>
      `
    }

    // 5. Email de confirmation (client)
    const clientEmail = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: '✅ Votre message a bien été reçu - Ytech Solutions',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #007bff; color: white; padding: 30px; text-align: center; border-radius: 5px 5px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Ytech Solutions</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Message reçu avec succès</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none;">
            <h2 style="color: #333; margin-top: 0;">Bonjour ${name},</h2>
            
            <p>Nous vous confirmons avoir bien reçu votre message et vous en remercions.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #007bff;">Résumé de votre message :</h3>
              <p style="white-space: pre-wrap; line-height: 1.6; font-style: italic;">${message.substring(0, 200)}${message.length > 200 ? '...' : ''}</p>
            </div>
            
            <p>Nous traiterons votre demande dans les plus brefs délais et vous répondrons dans un délai maximum de 24 heures ouvrées.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://ytech-solutions.com" style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Visiter notre site
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Cordialement,<br>
              L'équipe Ytech Solutions
            </p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 5px 5px; color: #666; font-size: 12px;">
            <p>© 2026 Ytech Solutions - Tous droits réservés</p>
            <p>Cet email a été généré automatiquement, merci de ne pas y répondre.</p>
          </div>
        </div>
      `
    }

    // 6. Envoi des emails
    await Promise.all([
      transporter.sendMail(adminEmail),
      transporter.sendMail(clientEmail)
    ])

    return NextResponse.json(
      { 
        success: true, 
        message: 'Message envoyé avec succès. Vous recevrez une confirmation par email.' 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Contact form error:', error)
    
    return NextResponse.json(
      { 
        error: 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer plus tard.' 
      },
      { status: 500 }
    )
  }
}
