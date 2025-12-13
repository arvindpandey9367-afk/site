import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const siteName = 'Arvind Pandey | Portfolio & Blog'
const siteDescription =
  'Portfolio and blog of Arvind Pandey — IT lecturer and tech consultant sharing articles, tutorials, and insights.'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://arvindpandey.vercel.app'

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: '%s | Arvind Pandey',
  },
  description: siteDescription,
  keywords: [
    'Arvind',
    'Arvind Pandey',
    'IT lecturer',
    'tech consultant',
    'Next.js blog',
    'technology articles',
    'portfolio',
  ],
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: siteUrl,
    siteName: siteName,
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: siteDescription,
  },
  icons: {
    icon: ['/favicon.ico', '/img0.jpg'],
    shortcut: ['/favicon.ico', '/img0.jpg'],
    apple: ['/img0.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
