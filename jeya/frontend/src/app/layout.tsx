import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: "JEYA — O'zbek AI Yordamchisi",
  description: "O'zbek tilida ovozli va matnli AI yordamchi platformasi",
}

// Sahifalarni request vaqtida render qilish (statik prerender o'rniga)
export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz">
      <body className="font-sans bg-jeya-dark text-jeya-text min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
