'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { Menu, X, Cpu } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass border-b border-jeya-border' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded border border-jeya-cyan/40 flex items-center justify-center group-hover:border-jeya-cyan transition-colors"
            style={{ boxShadow: '0 0 10px rgba(0,245,255,0.2)' }}>
            <Cpu size={16} className="text-jeya-cyan" />
          </div>
          <span className="font-black text-xl tracking-wider neon-text-cyan">JEYA</span>
          <span className="text-jeya-muted text-xs">AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-xs tracking-wider text-jeya-muted">
          {['IMKONIYATLAR','QANDAY ISHLAYDI','NARXLAR'].map((item) => (
            <Link key={item} href="#" className="hover:text-jeya-cyan transition-colors">{item}</Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Link href="/dashboard"
              className="border border-jeya-cyan/60 text-jeya-cyan text-sm px-5 py-2 rounded-lg hover:bg-jeya-cyan/10 hover:shadow-[0_0_15px_rgba(0,245,255,0.3)] transition-all">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/auth/login" className="text-jeya-muted hover:text-jeya-cyan text-sm px-4 py-2 transition-colors">Kirish</Link>
              <Link href="/auth/register"
                className="border border-jeya-emerald/60 text-jeya-emerald text-sm px-5 py-2 rounded-lg hover:bg-jeya-emerald/10 hover:shadow-[0_0_15px_rgba(0,255,135,0.3)] transition-all">
                Boshlash
              </Link>
            </>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-jeya-muted">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden glass border-t border-jeya-border px-6 py-5 flex flex-col gap-4">
          <Link href="/auth/login" className="text-jeya-muted text-sm" onClick={() => setOpen(false)}>Kirish</Link>
          <Link href="/auth/register" className="text-jeya-emerald text-sm border border-jeya-emerald/40 px-4 py-2 rounded-lg text-center" onClick={() => setOpen(false)}>Boshlash</Link>
        </div>
      )}
    </nav>
  )
}
