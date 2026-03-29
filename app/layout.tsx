import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/components/providers/session-provider'
import { SessionExpiryAlert } from '@/components/session-expiry-alert'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-space-grotesk'
});

export const metadata: Metadata = {
  title: 'Ytech Solutions | Services Numériques & Développement Web',
  description: 'Ytech Solutions - Votre partenaire de confiance pour le développement web, e-commerce, maintenance et hébergement. Solutions sur mesure pour PME.',
  keywords: ['développement web', 'e-commerce', 'site vitrine', 'hébergement', 'maintenance web', 'PME', 'agence digitale'],
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/placeholder-logo.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased overflow-x-hidden`}>
        <Providers>
          <SessionExpiryAlert />
          {children}
          <Analytics />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
