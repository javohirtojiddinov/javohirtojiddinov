'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { apiClient } from '@/lib/api'
import { MessageSquare, FileText, Upload, Brain, ArrowRight, Clock, Zap } from 'lucide-react'
import Card from '@/components/ui/Card'

interface Stats {
  total_conversations: number
  total_documents: number
  total_files: number
  total_memories: number
}

interface RecentConv {
  id: string
  title: string
  created_at: string
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<Stats>({ total_conversations: 0, total_documents: 0, total_files: 0, total_memories: 0 })
  const [recentConvs, setRecentConvs] = useState<RecentConv[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, convsRes] = await Promise.all([
          apiClient.get('/chat/stats').catch(() => ({ data: stats })),
          apiClient.get('/chat/conversations').catch(() => ({ data: [] })),
        ])
        setStats(statsRes.data)
        setRecentConvs(convsRes.data.slice(0, 5))
      } catch (e) {}
    }
    fetchData()
  }, [])

  const statCards = [
    { label: "Suhbatlar", value: stats.total_conversations, icon: MessageSquare, color: "text-indigo-400", bg: "bg-indigo-500/10" },
    { label: "Hujjatlar", value: stats.total_documents, icon: FileText, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Fayllar", value: stats.total_files, icon: Upload, color: "text-cyan-400", bg: "bg-cyan-500/10" },
    { label: "Xotiralar", value: stats.total_memories, icon: Brain, color: "text-purple-400", bg: "bg-purple-500/10" },
  ]

  const quickActions = [
    { href: '/dashboard/chat', label: 'Yangi suhbat boshlash', icon: MessageSquare, desc: 'JEYA bilan gaplashing' },
    { href: '/dashboard/documents', label: 'Hujjat yaratish', icon: FileText, desc: 'AI yordamida hujjat yarating' },
    { href: '/dashboard/files', label: 'Fayl yuklash', icon: Upload, desc: 'Faylingizni tahlil qiling' },
  ]

  return (
    <div className="p-8 max-w-6xl">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-jeya-text mb-2">
          Xush kelibsiz, {user?.full_name?.split(' ')[0] || 'Foydalanuvchi'}!
        </h1>
        <p className="text-jeya-muted">JEYA bilan bugun nima qilmoqchisiz?</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.label} className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
              <stat.icon size={22} className={stat.color} />
            </div>
            <div>
              <div className="text-2xl font-bold text-jeya-text">{stat.value}</div>
              <div className="text-sm text-jeya-muted">{stat.label}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-jeya-text mb-4 flex items-center gap-2">
            <Zap size={18} className="text-jeya-accent" />
            Tezkor harakatlar
          </h2>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <Card hover className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-jeya-accent/20 flex items-center justify-center flex-shrink-0">
                    <action.icon size={18} className="text-jeya-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-jeya-text text-sm">{action.label}</div>
                    <div className="text-xs text-jeya-muted">{action.desc}</div>
                  </div>
                  <ArrowRight size={16} className="text-jeya-muted" />
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent conversations */}
        <div>
          <h2 className="text-lg font-semibold text-jeya-text mb-4 flex items-center gap-2">
            <Clock size={18} className="text-jeya-accent" />
            So'nggi suhbatlar
          </h2>
          {recentConvs.length === 0 ? (
            <Card className="text-center py-8">
              <MessageSquare size={32} className="text-jeya-muted mx-auto mb-3" />
              <p className="text-jeya-muted text-sm">Hali suhbatlar yo'q</p>
              <Link href="/dashboard/chat" className="text-jeya-accent text-sm hover:underline mt-2 inline-block">
                Birinchi suhbatni boshlang
              </Link>
            </Card>
          ) : (
            <div className="space-y-2">
              {recentConvs.map((conv) => (
                <Link key={conv.id} href={`/dashboard/chat?id=${conv.id}`}>
                  <Card hover className="py-3 px-4">
                    <div className="font-medium text-jeya-text text-sm truncate">{conv.title}</div>
                    <div className="text-xs text-jeya-muted mt-1">
                      {new Date(conv.created_at).toLocaleDateString('uz-UZ')}
                    </div>
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
