import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import pool from '@/lib/db'

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

// Fonction pour envoyer l'email de confirmation pour plusieurs packs
async function sendMultiplePacksConfirmationEmail(orderData: any, packs: any[]) {
  try {
    console.log('Tentative d\'envoi d\'email à:', orderData.client_email)
    
    // Vérifier si les variables SMTP sont configurées
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('Configuration SMTP manquante, envoi d\'email désactivé')
      return false
    }

    // Calculer le total
    const totalPrice = packs.reduce((sum: number, pack: any) => {
      return sum + parseFloat(pack.pack_price)
    }, 0)

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: orderData.client_email,
      subject: `Confirmation de commande multiple - ${packs.length} pack(s)`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="margin: 0; font-size: 28px;">Ytech Solutions</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Confirmation de commande multiple</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0; margin-bottom: 20px;">Merci pour votre commande !</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Nous avons bien reçu votre commande pour <strong>${packs.length} pack(s)</strong>. 
              Voici le récapitulatif de votre commande :
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
              <h3 style="color: #333; margin-top: 0; margin-bottom: 15px;">Détails de la commande</h3>
              
              ${packs.map((pack: any, index: number) => `
                <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #eee; ${index === packs.length - 1 ? 'border-bottom: none; margin-bottom: 0; padding-bottom: 0;' : ''}">
                  <h4 style="color: #333; margin-bottom: 10px;">Pack ${index + 1}: ${pack.pack_name}</h4>
                  <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
                    <tr>
                      <td style="padding: 5px 0; color: #666; font-weight: bold;">Prix :</td>
                      <td style="padding: 5px 0; color: #333;">${parseFloat(pack.pack_price).toLocaleString('fr-FR')} DHS</td>
                    </tr>
                    ${pack.pack_features && pack.pack_features.length > 0 ? `
                    <tr>
                      <td style="padding: 5px 0; color: #666; font-weight: bold; vertical-align: top;">Fonctionnalités :</td>
                      <td style="padding: 5px 0; color: #333;">
                        <ul style="margin: 0; padding-left: 20px; color: #666;">
                          ${pack.pack_features.map((feature: string) => `<li style="margin-bottom: 5px;">${feature}</li>`).join('')}
                        </ul>
                      </td>
                    </tr>` : ''}
                  </table>
                </div>
              `).join('')}
              
              <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #667eea;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Client :</td>
                    <td style="padding: 8px 0; color: #333;">${orderData.client_name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Email :</td>
                    <td style="padding: 8px 0; color: #333;">${orderData.client_email}</td>
                  </tr>
                  ${orderData.client_phone ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Téléphone :</td>
                    <td style="padding: 8px 0; color: #333;">${orderData.client_phone}</td>
                  </tr>` : ''}
                  ${orderData.client_company ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Entreprise :</td>
                    <td style="padding: 8px 0; color: #333;">${orderData.client_company}</td>
                  </tr>` : ''}
                  ${orderData.client_city ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Ville :</td>
                    <td style="padding: 8px 0; color: #333;">${orderData.client_city}</td>
                  </tr>` : ''}
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold; font-size: 18px;">Total :</td>
                    <td style="padding: 8px 0; color: #333; font-size: 18px; font-weight: bold; color: #667eea;">${totalPrice.toLocaleString('fr-FR')} DHS</td>
                  </tr>
                </table>
              </div>
            </div>
            
            <div style="background: #e3f2fd; border: 1px solid #bbdefb; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <p style="margin: 0; color: #1976d2; font-weight: 500;">
                <strong>Prochaines étapes :</strong><br>
                Notre équipe va étudier votre demande et vous contacter dans les plus brefs délais pour finaliser les détails de vos projets.
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
    return true
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error as Error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orders, clientInfo } = body
    
    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Aucune commande fournie' },
        { status: 400 }
      )
    }

    if (!clientInfo) {
      return NextResponse.json(
        { success: false, error: 'Informations client manquantes' },
        { status: 400 }
      )
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(clientInfo.email)) {
      return NextResponse.json(
        { success: false, error: 'Email invalide' },
        { status: 400 }
      )
    }

    // Créer toutes les commandes en parallèle
    const orderPromises = orders.map(async (orderData: any) => {
      // Vérifier si une commande existe déjà pour cet email et ce pack
      const existingOrder = await pool.query(
        'SELECT id FROM pack_orders WHERE client_email = $1 AND pack_id = $2 AND status != $3',
        [clientInfo.email, orderData.pack_id, 'cancelled']
      )
      
      if (existingOrder.rows.length > 0) {
        return { 
          success: false, 
          error: 'Une commande pour ce pack existe déjà pour cet email', 
          packName: orderData.pack_name 
        }
      }
      
      // Insérer dans la base de données
      const result = await pool.query(`
        INSERT INTO pack_orders (
          pack_id, pack_name, pack_price, pack_features,
          client_name, client_email, client_phone, client_company, client_city,
          project_description, status, is_validated, payment_status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *
      `, [
        orderData.pack_id, orderData.pack_name, orderData.pack_price, orderData.pack_features || [],
        clientInfo.name, clientInfo.email, clientInfo.phone || null, clientInfo.company || null, clientInfo.city || null,
        null, 'pending', false, 'pending'
      ])
      
      return { success: true, data: result.rows[0], packName: orderData.pack_name }
    })

    const results = await Promise.all(orderPromises)
    
    // Séparer les succès et les échecs
    const successfulOrders = results.filter(r => r.success)
    const failedOrders = results.filter(r => !r.success)
    
    // Préparer les données pour l'email
    const emailOrderData = {
      client_name: clientInfo.name,
      client_email: clientInfo.email,
      client_phone: clientInfo.phone || '',
      client_company: clientInfo.company || '',
      client_city: clientInfo.city || ''
    }
    
    const packsForEmail = successfulOrders.map(r => r.data)
    
    // Envoyer l'email de confirmation seulement pour les commandes réussies
    if (successfulOrders.length > 0) {
      sendMultiplePacksConfirmationEmail(emailOrderData, packsForEmail).catch(error => {
        console.error('Échec de l\'envoi de l\'email de confirmation:', error)
      })
    }
    
    return NextResponse.json({
      success: true,
      successfulOrders: successfulOrders.length,
      failedOrders: failedOrders.length,
      totalOrders: orders.length,
      message: `${successfulOrders.length} commande(s) créée(s) avec succès${failedOrders.length > 0 ? `, ${failedOrders.length} échouée(s)` : ''}`,
      errors: failedOrders.map(f => f.error)
    })
  } catch (error) {
    console.error('POST /api/multiple-pack-orders error:', error)
    
    return NextResponse.json(
      { success: false, error: 'Erreur serveur interne. Veuillez réessayer plus tard.' },
      { status: 500 }
    )
  }
}
