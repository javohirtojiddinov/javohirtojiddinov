'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="uz">
      <body className="font-sans bg-jeya-dark text-jeya-text min-h-screen">
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
          <h1 className="text-6xl font-bold neon-text-emerald">500</h1>
          <p className="text-jeya-muted max-w-md">
            Tizimda xatolik yuz berdi. Iltimos, qaytadan urinib ko&apos;ring.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-3 rounded-lg border border-jeya-emerald/60 text-jeya-emerald hover:shadow-[0_0_20px_rgba(0,255,135,0.3)] transition-shadow"
          >
            Qaytadan urinish
          </button>
        </div>
      </body>
    </html>
  )
}
