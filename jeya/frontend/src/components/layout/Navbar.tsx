'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-jeya-accent flex items-center justify-center text-white font-black text-base group-hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] transition-shadow">
            J
          </div>
          <span className="font-bold text-xl text-jeya-text">JEYA</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 text-sm text-jeya-muted">
          <Link href="#features" className="hover:text-jeya-text transition-colors">Imkoniyatlar</Link>
          <Link href="#how-it-works" className="hover:text-jeya-text transition-colors">Qanday ishlaydi</Link>
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="bg-jeya-accent hover:bg-jeya-accent-glow text-white px-5 py-2 rounded-lg font-medium text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-jeya-muted hover:text-jeya-text px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Kirish
              </Link>
              <Link
                href="/auth/register"
                className="bg-jeya-accent hover:bg-jeya-accent-glow text-white px-5 py-2 rounded-lg font-medium text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]"
              >
                Ro'yxatdan o'tish
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-jeya-text"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-jeya-border px-6 py-6 flex flex-col gap-4">
          <Link href="#features" className="text-jeya-muted hover:text-jeya-text" onClick={() => setMenuOpen(false)}>Imkoniyatlar</Link>
          <Link href="#how-it-works" className="text-jeya-muted hover:text-jeya-text" onClick={() => setMenuOpen(false)}>Qanday ishlaydi</Link>
          <div className="border-t border-jeya-border pt-4 flex flex-col gap-3">
            <Link href="/auth/login" className="text-jeya-muted hover:text-jeya-text font-medium" onClick={() => setMenuOpen(false)}>Kirish</Link>
            <Link href="/auth/register" className="bg-jeya-accent text-white px-5 py-2 rounded-lg font-medium text-center" onClick={() => setMenuOpen(false)}>Ro'yxatdan o'tish</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
