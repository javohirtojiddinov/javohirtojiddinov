'use client'
import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api'
import { Brain, Trash2, Loader, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'

interface Mem { id: string; content: string; memory_type: string; created_at: string }

const TYPES: Record<string, { label: string; cls: string }> = {
  fact: { label: 'Fakt', cls: 'border-jeya-cyan/30 text-jeya-cyan' },
  preference: { label: 'Afzallik', cls: 'border-jeya-emerald/30 text-jeya-emerald' },
  context: { label: 'Kontekst', cls: 'border-yellow-500/30 text-yellow-400' },
  other: { label: 'Boshqa', cls: 'border-jeya-muted/30 text-jeya-muted' },
}

export default function MemoryPage() {
  const [mems, setMems] = useState<Mem[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [searching, setSearching] = useState(false)

  const fetch = async () => {
    try { const r = await apiClient.get('/memory'); setMems(r.data) } catch { toast.error('Yuklash xatosi') } finally { setLoading(false) }
  }
  useEffect(() => { fetch() }, [])

  const search = async () => {
    if (!q.trim()) { fetch(); return }
    setSearching(true)
    try { const r = await apiClient.post('/memory/search', { query: q }); setMems(r.data) } catch { toast.error('Qidirish xatosi') } finally { setSearching(false) }
  }

  const del = async (id: string) => {
    await apiClient.delete(`/memory/${id}`).catch(() => {})
    setMems((p) => p.filter((m) => m.id !== id))
    toast.success("O'chirildi")
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <div className="text-xs tracking-[0.3em] text-jeya-cyan mb-1">SHAXSIY XOTIRA</div>
        <h1 className="text-2xl font-black">Xotira bazasi</h1>
      </div>
      <div className="flex gap-3 mb-8">
        <div className="flex-1">
          <Input placeholder="Xotiralarda qidiring..." value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && search()} />
        </div>
        <button onClick={search} disabled={searching}
          className="border border-jeya-cyan/50 text-jeya-cyan px-5 rounded-lg flex items-center gap-2 hover:bg-jeya-cyan/10 transition-all disabled:opacity-40 text-sm">
          {searching ? <Loader size={14} className="animate-spin" /> : <Search size={14} />} Qidirish
        </button>
      </div>
      {loading ? <div className="flex justify-center py-12"><Loader className="text-jeya-cyan animate-spin" size={24} /></div>
        : mems.length === 0 ? <Card className="text-center py-12"><Brain size={32} className="text-jeya-muted mx-auto mb-3" /><p className="text-jeya-muted text-sm">Xotiralar yo'q</p></Card>
        : <div className="space-y-3">{mems.map((m) => {
            const t = TYPES[m.memory_type] || TYPES.other
            return (
              <Card key={m.id} className="flex items-start gap-4">
                <Brain size={15} className="text-jeya-cyan mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${t.cls}`}>{t.label}</span>
                    <span className="text-xs text-jeya-muted">{new Date(m.created_at).toLocaleDateString('uz-UZ')}</span>
                  </div>
                  <p className="text-jeya-text text-sm">{m.content}</p>
                </div>
                <button onClick={() => del(m.id)} className="text-jeya-muted hover:text-red-400 p-1.5 rounded hover:bg-red-500/10 transition-all">
                  <Trash2 size={14} />
                </button>
              </Card>
            )
          })}</div>}
    </div>
  )
}
