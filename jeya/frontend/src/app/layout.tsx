import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "JEYA — O'zbek AI Yordamchisi",
  description: "O'zbek tilida ovozli va matnli AI yordamchi platformasi",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz">
      <body className={`${inter.className} bg-jeya-dark text-jeya-text min-h-screen`}>
        {children}
        <Toaster position="top-right" toastOptions={{
          style: { background: '#12121a', color: '#e2e8f0', border: '1px solid #1e1e2e' }
        }} />
      </body>
    </html>
  )
}
