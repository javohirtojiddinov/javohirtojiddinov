'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { MessageSquare, FileText, Upload, Brain, Settings, LogOut, ChevronRight, Plus, Cpu } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { clsx } from 'clsx'

const nav = [
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

  return (
    <aside className="h-full flex flex-col w-60 flex-shrink-0 border-r border-jeya-border bg-jeya-card/60">
      <div className="p-5 border-b border-jeya-border">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded border border-jeya-cyan/40 flex items-center justify-center group-hover:border-jeya-cyan transition-colors"
            style={{ boxShadow: '0 0 8px rgba(0,245,255,0.15)' }}>
            <Cpu size={14} className="text-jeya-cyan" />
          </div>
          <span className="font-black tracking-wider text-base neon-text-cyan">JEYA</span>
        </Link>
      </div>

      <div className="p-3">
        <Link href="/dashboard/chat"
          className="flex items-center gap-2 w-full border border-jeya-emerald/50 text-jeya-emerald text-xs px-3 py-2.5 rounded-lg hover:bg-jeya-emerald/10 hover:shadow-[0_0_12px_rgba(0,255,135,0.2)] transition-all tracking-wider">
          <Plus size={14} />
          YANGI SUHBAT
        </Link>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {nav.map((item) => {
          const active = pathname.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs tracking-wider transition-all duration-200',
                active
                  ? 'border border-jeya-cyan/30 text-jeya-cyan bg-jeya-cyan/5 shadow-[0_0_10px_rgba(0,245,255,0.08)]'
                  : 'text-jeya-muted hover:text-jeya-text hover:bg-jeya-border/40'
              )}>
              <item.icon size={15} />
              <span className="flex-1">{item.label.toUpperCase()}</span>
              {active && <ChevronRight size={12} />}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-jeya-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded border border-jeya-cyan/30 flex items-center justify-center text-jeya-cyan text-xs font-bold">
            {user?.full_name?.charAt(0).toUpperCase() || 'F'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-jeya-text truncate">{user?.full_name}</p>
            <p className="text-xs text-jeya-muted truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={() => { logout(); router.push('/') }}
          className="flex items-center gap-2 w-full text-jeya-muted hover:text-red-400 text-xs px-2 py-1.5 rounded hover:bg-red-500/10 transition-all">
          <LogOut size={13} />
          CHIQISH
        </button>
      </div>
    </aside>
  )
}
