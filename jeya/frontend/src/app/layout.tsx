import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "JEYA AI — Aqlli Raqamli Operator",
  description: "Windows 11 va web uchun yaratilgan aqlli AI operator va shaxsiy yordamchi",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body className={`${inter.className} bg-jeya-dark text-jeya-text min-h-screen`}>
        {children}
        <Toaster position="top-right" toastOptions={{
          style: { background: '#080f18', color: '#e2f4ff', border: '1px solid #00f5ff33' }
        }} />
      </body>
    </html>
  )
}
