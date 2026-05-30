'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { apiClient } from '@/lib/api'
import { MessageSquare, FileText, Upload, Brain, ArrowRight, Activity } from 'lucide-react'
import Card from '@/components/ui/Card'

interface Stats { total_conversations: number; total_documents: number; total_files: number; total_memories: number }

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<Stats>({ total_conversations: 0, total_documents: 0, total_files: 0, total_memories: 0 })
  const [convs, setConvs] = useState<any[]>([])
  useEffect(() => {
    Promise.all([
      apiClient.get('/chat/stats').catch(() => ({ data: stats })),
      apiClient.get('/chat/conversations').catch(() => ({ data: [] })),
    ]).then(([s, c]) => { setStats(s.data); setConvs(c.data.slice(0, 5)) })
  }, [])

  const statCards = [
    { label: 'SUHBATLAR', value: stats.total_conversations, icon: MessageSquare, color: 'text-jeya-cyan', glow: '#00f5ff' },
    { label: 'HUJJATLAR', value: stats.total_documents, icon: FileText, color: 'text-jeya-emerald', glow: '#00ff87' },
    { label: 'FAYLLAR', value: stats.total_files, icon: Upload, color: 'text-jeya-cyan', glow: '#00f5ff' },
    { label: 'XOTIRALAR', value: stats.total_memories, icon: Brain, color: 'text-jeya-emerald', glow: '#00ff87' },
  ]
  const actions = [
    { href: '/dashboard/chat', label: 'Yangi suhbat', icon: MessageSquare, desc: 'JEYA bilan gaplashing' },
    { href: '/dashboard/documents', label: 'Hujjat yaratish', icon: FileText, desc: 'AI yordamida yarating' },
    { href: '/dashboard/files', label: 'Fayl yuklash', icon: Upload, desc: 'Faylingizni tahlil qiling' },
  ]

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <div className="text-xs tracking-[0.3em] text-jeya-cyan mb-1">BOSHQARUV PANELI</div>
        <h1 className="text-2xl font-black">Xush kelibsiz, {user?.full_name?.split(' ')[0]}!</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <Card key={s.label} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg border border-jeya-border flex items-center justify-center">
              <s.icon size={18} className={s.color} style={{ filter: `drop-shadow(0 0 6px ${s.glow})` }} />
            </div>
            <div>
              <div className="text-xl font-black text-jeya-text">{s.value}</div>
              <div className="text-xs text-jeya-muted tracking-wider">{s.label}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="text-xs tracking-[0.2em] text-jeya-muted mb-4 flex items-center gap-2">
            <Activity size={13} className="text-jeya-cyan" /> TEZKOR HARAKATLAR
          </div>
          <div className="space-y-3">
            {actions.map((a) => (
              <Link key={a.href} href={a.href}>
                <Card hover className="flex items-center gap-4 mb-3">
                  <div className="w-9 h-9 rounded-lg border border-jeya-cyan/20 flex items-center justify-center">
                    <a.icon size={16} className="text-jeya-cyan" style={{ filter: 'drop-shadow(0 0 4px #00f5ff)' }} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-jeya-text text-sm">{a.label}</div>
                    <div className="text-xs text-jeya-muted">{a.desc}</div>
                  </div>
                  <ArrowRight size={14} className="text-jeya-muted" />
                </Card>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs tracking-[0.2em] text-jeya-muted mb-4">SO'NGGI SUHBATLAR</div>
          {convs.length === 0 ? (
            <Card className="text-center py-8">
              <MessageSquare size={28} className="text-jeya-muted mx-auto mb-3" style={{ filter: 'drop-shadow(0 0 6px #00f5ff44)' }} />
              <p className="text-jeya-muted text-xs">Hali suhbatlar yo'q</p>
              <Link href="/dashboard/chat" className="text-jeya-cyan text-xs hover:underline mt-2 inline-block">Boshlang</Link>
            </Card>
          ) : (
            <div className="space-y-2">
              {convs.map((c) => (
                <Link key={c.id} href={`/dashboard/chat?id=${c.id}`}>
                  <Card hover className="py-3 px-4">
                    <div className="text-jeya-text text-xs font-medium truncate">{c.title}</div>
                    <div className="text-jeya-muted text-xs mt-0.5">{new Date(c.created_at).toLocaleDateString('uz-UZ')}</div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
