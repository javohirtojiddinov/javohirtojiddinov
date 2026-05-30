'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api'
import { Brain, Trash2, Loader, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'

interface Memory {
  id: string
  content: string
  memory_type: string
  created_at: string
}

const MEMORY_TYPES: Record<string, { label: string; color: string }> = {
  fact: { label: "Fakt", color: "text-blue-400 bg-blue-500/10" },
  preference: { label: "Afzallik", color: "text-purple-400 bg-purple-500/10" },
  context: { label: "Kontekst", color: "text-green-400 bg-green-500/10" },
  other: { label: "Boshqa", color: "text-yellow-400 bg-yellow-500/10" },
}

export default function MemoryPage() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)

  const fetchMemories = async () => {
    try {
      const res = await apiClient.get('/memory')
      setMemories(res.data)
    } catch (e) {
      toast.error("Xotiralarni yuklashda xato")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMemories() }, [])

  const handleSearch = async () => {
    if (!searchQuery.trim()) { fetchMemories(); return }
    setSearching(true)
    try {
      const res = await apiClient.post('/memory/search', { query: searchQuery })
      setMemories(res.data)
    } catch (e) {
      toast.error("Qidirishda xato")
    } finally {
      setSearching(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/memory/${id}`)
      setMemories((prev) => prev.filter((m) => m.id !== id))
      toast.success("Xotira o'chirildi")
    } catch (e) {
      toast.error("O'chirishda xato")
    }
  }

  const typeInfo = (type: string) => MEMORY_TYPES[type] || MEMORY_TYPES.other

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-jeya-text">Shaxsiy xotira</h1>
        <p className="text-jeya-muted text-sm mt-1">JEYA siz haqingizda saqlab qolgan ma'lumotlar</p>
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-8">
        <div className="flex-1">
          <Input
            placeholder="Xotiralarda qidiring..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={searching}
          className="bg-jeya-accent hover:bg-jeya-accent-glow text-white px-5 rounded-xl flex items-center gap-2 transition-all duration-300 disabled:opacity-50"
        >
          {searching ? <Loader size={16} className="animate-spin" /> : <Search size={16} />}
          Qidirish
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader size={32} className="text-jeya-accent animate-spin" />
        </div>
      ) : memories.length === 0 ? (
        <Card className="text-center py-16">
          <Brain size={48} className="text-jeya-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-jeya-text mb-2">Xotiralar yo'q</h3>
          <p className="text-jeya-muted text-sm max-w-sm mx-auto">
            JEYA suhbatlar davomida muhim ma'lumotlarni avtomatik ravishda xotirada saqlaydi
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {memories.map((memory) => {
            const t = typeInfo(memory.memory_type)
            return (
              <Card key={memory.id} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-jeya-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Brain size={15} className="text-jeya-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${t.color}`}>{t.label}</span>
                    <span className="text-xs text-jeya-muted">
                      {new Date(memory.created_at).toLocaleDateString('uz-UZ')}
                    </span>
                  </div>
                  <p className="text-jeya-text text-sm leading-relaxed">{memory.content}</p>
                </div>
                <button
                  onClick={() => handleDelete(memory.id)}
                  className="text-jeya-muted hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-all flex-shrink-0"
                >
                  <Trash2 size={15} />
                </button>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
