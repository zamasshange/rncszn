import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Fraunces } from 'next/font/google'
import './globals.css'
import { SmoothScroll } from '@/components/smooth-scroll'
import { CustomCursor } from '@/components/custom-cursor'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'RENAISSANCE — The Future of Y2K Fashion',
  description:
    'RENAISSANCE is a premium Y2K luxury fashion house. Chrome, holographic, and editorial pieces engineered for the future of fashion.',
  generator: 'v0.app',
  openGraph: {
    title: 'RENAISSANCE — The Future of Y2K Fashion',
    description:
      'A premium Y2K luxury fashion house. Chrome, holographic, and editorial pieces engineered for the future of fashion.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${fraunces.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <CustomCursor />
        <SmoothScroll>{children}</SmoothScroll>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
