import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Configuration du transporteur d'email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { packName, packPrice, clientEmail, clientName } = body
    
    // Vérifier si les variables SMTP sont configurées
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('Configuration SMTP manquante, envoi d\'email désactivé')
      return NextResponse.json(
        { success: false, error: 'Configuration SMTP manquante' },
        { status: 500 }
      )
    }

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: clientEmail,
      subject: `Confirmation de paiement - Pack ${packName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="margin: 0; font-size: 28px;">Ytech Solutions</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Confirmation de paiement</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0; margin-bottom: 20px;">Paiement réussi !</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Merci ${clientName} ! Votre paiement pour le pack <strong>${packName}</strong> a été traité avec succès. 
              Voici le récapitulatif de votre transaction :
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
              <h3 style="color: #333; margin-top: 0; margin-bottom: 15px;">Détails du paiement</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Pack :</td>
                  <td style="padding: 8px 0; color: #333;">${packName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Montant :</td>
                  <td style="padding: 8px 0; color: #333;">${packPrice} DHS</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Statut :</td>
                  <td style="padding: 8px 0; color: #28a745; font-weight: bold;">Payé</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Date :</td>
                  <td style="padding: 8px 0; color: #333;">${new Date().toLocaleDateString('fr-FR')}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <p style="margin: 0; font-weight: 500;">
                <strong>Prochaines étapes :</strong><br>
                Notre équipe va vous contacter dans les plus brefs délais pour débuter le développement de votre projet.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; margin: 0;">Cordialement,</p>
            <p style="color: #333; margin: 5px 0 0 0; font-weight: bold;">L'équipe Ytech Solutions</p>
            <p style="color: #666; margin: 10px 0 0 0; font-size: 14px;">
              Email : ${process.env.SMTP_USER}<br>
              Téléphone : +212 5XX-XXXXXX
            </p>
          </div>
        </div>
      `,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Email de paiement envoyé:', result.messageId)
    
    return NextResponse.json({
      success: true,
      message: 'Email de confirmation envoyé avec succès'
    })
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de paiement:', error as Error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    )
  }
}
