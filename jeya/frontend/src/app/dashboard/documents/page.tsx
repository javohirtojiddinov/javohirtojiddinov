'use client'
import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api'
import { FileText, Plus, Download, Trash2, Loader, X } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface Doc { id: string; title: string; doc_type: string; content: string; created_at: string }
const TYPES = [{ value: 'letter', label: 'Xat' },{ value: 'report', label: 'Hisobot' },{ value: 'resume', label: 'Rezyume' },{ value: 'application', label: 'Ariza' },{ value: 'contract', label: 'Shartnoma' },{ value: 'other', label: 'Boshqa' }]

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Doc[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [gen, setGen] = useState(false)
  const [form, setForm] = useState({ title: '', doc_type: 'letter', prompt: '' })

  useEffect(() => {
    apiClient.get('/documents').then((r) => setDocs(r.data)).catch(() => toast.error('Yuklash xatosi')).finally(() => setLoading(false))
  }, [])

  const handleGenerate = async () => {
    if (!form.title || !form.prompt) { toast.error("Barcha maydonlarni to'ldiring"); return }
    setGen(true)
    try {
      const r = await apiClient.post('/documents/generate', form)
      setDocs((p) => [r.data, ...p])
      setModal(false)
      setForm({ title: '', doc_type: 'letter', prompt: '' })
      toast.success('Hujjat yaratildi!')
    } catch { toast.error('Yaratish xatosi') } finally { setGen(false) }
  }

  const handleDelete = async (id: string) => {
    await apiClient.delete(`/documents/${id}`).catch(() => toast.error('Xato'))
    setDocs((p) => p.filter((d) => d.id !== id))
    toast.success("O'chirildi")
  }

  const handleExport = async (id: string, fmt: string) => {
    try {
      const r = await apiClient.get(`/documents/${id}/export?format=${fmt}`, { responseType: 'blob' })
      const url = URL.createObjectURL(new Blob([r.data]))
      const a = document.createElement('a'); a.href = url; a.download = `document.${fmt}`; a.click()
    } catch { toast.error('Yuklab olish xatosi') }
  }

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-xs tracking-[0.3em] text-jeya-cyan mb-1">HUJJATLAR</div>
          <h1 className="text-2xl font-black">Hujjat boshqaruvi</h1>
        </div>
        <Button onClick={() => setModal(true)} variant="emerald"><Plus size={15} className="mr-2" />Yangi hujjat</Button>
      </div>

      {loading ? <div className="flex justify-center py-16"><Loader className="text-jeya-cyan animate-spin" size={28} /></div>
        : docs.length === 0 ? (
          <Card className="text-center py-16">
            <FileText size={40} className="text-jeya-muted mx-auto mb-4" style={{ filter: 'drop-shadow(0 0 8px #00f5ff44)' }} />
            <p className="text-jeya-muted text-sm mb-4">Hujjatlar yo'q</p>
            <Button onClick={() => setModal(true)} variant="cyan" size="sm"><Plus size={13} className="mr-1" />Yaratish</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {docs.map((d) => (
              <Card key={d.id} hover className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <FileText size={16} className="text-jeya-cyan mt-0.5 flex-shrink-0" style={{ filter: 'drop-shadow(0 0 4px #00f5ff)' }} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-jeya-text text-sm truncate">{d.title}</h3>
                    <p className="text-xs text-jeya-muted">{TYPES.find((t) => t.value === d.doc_type)?.label} · {new Date(d.created_at).toLocaleDateString('uz-UZ')}</p>
                  </div>
                </div>
                <p className="text-jeya-muted text-xs line-clamp-3">{d.content}</p>
                <div className="flex gap-2 pt-2 border-t border-jeya-border">
                  <button onClick={() => handleExport(d.id,'pdf')} className="flex-1 text-jeya-muted hover:text-jeya-cyan text-xs py-1.5 rounded hover:bg-jeya-cyan/10 flex items-center justify-center gap-1 transition-all">
                    <Download size={11} /> PDF
                  </button>
                  <button onClick={() => handleExport(d.id,'docx')} className="flex-1 text-jeya-muted hover:text-jeya-cyan text-xs py-1.5 rounded hover:bg-jeya-cyan/10 flex items-center justify-center gap-1 transition-all">
                    <Download size={11} /> DOCX
                  </button>
                  <button onClick={() => handleDelete(d.id)} className="text-jeya-muted hover:text-red-400 text-xs px-2 py-1.5 rounded hover:bg-red-500/10 transition-all">
                    <Trash2 size={12} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-cyan rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-black text-jeya-text">Yangi hujjat</h2>
              <button onClick={() => setModal(false)}><X size={18} className="text-jeya-muted" /></button>
            </div>
            <div className="space-y-4">
              <Input label="Sarlavha" placeholder="Masalan: Ish arizasi" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <div>
                <label className="text-xs font-medium text-jeya-cyan/80 uppercase tracking-wider block mb-1.5">Tur</label>
                <select value={form.doc_type} onChange={(e) => setForm({ ...form, doc_type: e.target.value })}
                  className="w-full bg-jeya-dark border border-jeya-border text-jeya-text rounded-lg px-4 py-3 text-sm outline-none focus:border-jeya-cyan/60">
                  {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-jeya-cyan/80 uppercase tracking-wider block mb-1.5">Ko'rsatma</label>
                <textarea value={form.prompt} onChange={(e) => setForm({ ...form, prompt: e.target.value })}
                  placeholder="Hujjatda nima bo'lishi kerakligini yozing..." rows={4}
                  className="w-full bg-jeya-dark border border-jeya-border text-jeya-text placeholder-jeya-muted/50 rounded-lg px-4 py-3 text-sm outline-none focus:border-jeya-cyan/60 resize-none" />
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={() => setModal(false)}>Bekor</Button>
                <Button variant="cyan" className="flex-1" isLoading={gen} onClick={handleGenerate}>Yaratish</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
