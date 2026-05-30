'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  MessageSquare,
  FileText,
  Upload,
  Brain,
  Settings,
  LogOut,
  ChevronRight,
  Plus,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { clsx } from 'clsx'

const navItems = [
  { href: '/dashboard/chat', label: 'Chat', icon: MessageSquare },
  { href: '/dashboard/documents', label: 'Hujjatlar', icon: FileText },
  { href: '/dashboard/files', label: 'Fayllar', icon: Upload },
  { href: '/dashboard/memory', label: 'Xotira', icon: Brain },
  { href: '/dashboard/settings', label: 'Sozlamalar', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <aside className="h-full flex flex-col bg-jeya-card border-r border-jeya-border w-64 flex-shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-jeya-border">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-jeya-accent flex items-center justify-center text-white font-black text-sm group-hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-shadow">
            J
          </div>
          <span className="font-bold text-lg text-jeya-text">JEYA</span>
        </Link>
      </div>

      {/* New chat button */}
      <div className="p-4">
        <Link
          href="/dashboard/chat"
          className="flex items-center gap-2 w-full bg-jeya-accent hover:bg-jeya-accent-glow text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]"
        >
          <Plus size={16} />
          Yangi suhbat
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname?.startsWith(item.href) ?? false
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-jeya-accent/20 text-jeya-accent border border-jeya-accent/30'
                  : 'text-jeya-muted hover:text-jeya-text hover:bg-jeya-border/50'
              )}
            >
              <item.icon size={18} />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight size={14} />}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-jeya-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-jeya-accent/20 border border-jeya-accent/40 flex items-center justify-center text-jeya-accent font-bold text-sm">
            {user?.full_name?.charAt(0).toUpperCase() || 'F'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-jeya-text truncate">{user?.full_name || 'Foydalanuvchi'}</p>
            <p className="text-xs text-jeya-muted truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full text-jeya-muted hover:text-red-400 text-sm px-2 py-1.5 rounded-lg hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut size={15} />
          Chiqish
        </button>
      </div>
    </aside>
  )
}
