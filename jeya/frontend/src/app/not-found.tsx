import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center grid-bg">
      <h1 className="text-7xl font-bold neon-text-cyan">404</h1>
      <p className="text-jeya-muted max-w-md">
        Sahifa topilmadi. Siz qidirayotgan manzil mavjud emas yoki ko&apos;chirilgan.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-lg border border-jeya-cyan/60 text-jeya-cyan hover:shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-shadow"
      >
        Bosh sahifaga qaytish
      </Link>
    </div>
  )
}
