/** @type {import('next').NextConfig} */
const nextConfig = {
  // Supprimer l'icône Next.js de développement
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
    buildActivityPosition: 'bottom-right',
  },
  experimental: {
    optimizeCss: true
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // HSTS (HTTP Strict Transport Security) - Force HTTPS
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          // Content Security Policy - Prevention XSS et injections
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.stripe.com https://*.supabase.co; frame-src https://js.stripe.com https://www.google.com; upgrade-insecure-requests"
          },
          // X-Frame-Options - Protection contre le clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          // X-Content-Type-Options - Protection contre MIME sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // Referrer Policy - Contrôle des informations de référent
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Permissions Policy - Contrôle des fonctionnalités du navigateur
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()'
          },
          // Cross-origin isolation / resource policy (helps against data leaks)
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-site'
          },
          // Misc hardening headers
          {
            key: 'X-Permitted-Cross-Domain-Policies',
            value: 'none'
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'off'
          },
          // X-XSS-Protection - Protection XSS (legacy mais supporté)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ]
  },
  // Configuration HTTPS pour production
  poweredByHeader: false,
  // Compression et optimisation
  compress: true,
  // Désactiver les indicateurs de développement en production
  disableSourceMaps: process.env.NODE_ENV === 'production',
  // Limite de taille des payloads
  // Note: bodyParser et responseLimit sont maintenant gérés différemment dans Next.js 16
}

module.exports = nextConfig
