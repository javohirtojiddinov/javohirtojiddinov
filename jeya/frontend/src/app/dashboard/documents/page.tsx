'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api'
import { FileText, Plus, Download, Trash2, Loader, X } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface Document {
  id: string
  title: string
  doc_type: string
  content: string
  created_at: string
}

const DOC_TYPES = [
  { value: 'letter', label: 'Xat' },
  { value: 'report', label: 'Hisobot' },
  { value: 'resume', label: 'Rezyume' },
  { value: 'application', label: 'Ariza' },
  { value: 'contract', label: 'Shartnoma' },
  { value: 'other', label: 'Boshqa' },
]

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [form, setForm] = useState({ title: '', doc_type: 'letter', prompt: '' })

  const fetchDocuments = async () => {
    try {
      const res = await apiClient.get('/documents')
      setDocuments(res.data)
    } catch (e) {
      toast.error("Hujjatlarni yuklashda xato")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDocuments() }, [])

  const handleGenerate = async () => {
    if (!form.title || !form.prompt) {
      toast.error("Barcha maydonlarni to'ldiring")
      return
    }
    setGenerating(true)
    try {
      const res = await apiClient.post('/documents/generate', form)
      setDocuments((prev) => [res.data, ...prev])
      setShowModal(false)
      setForm({ title: '', doc_type: 'letter', prompt: '' })
      toast.success("Hujjat yaratildi!")
    } catch (e) {
      toast.error("Hujjat yaratishda xato")
    } finally {
      setGenerating(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/documents/${id}`)
      setDocuments((prev) => prev.filter((d) => d.id !== id))
      toast.success("Hujjat o'chirildi")
    } catch (e) {
      toast.error("O'chirishda xato")
    }
  }

  const handleExport = async (id: string, format: 'pdf' | 'docx') => {
    try {
      const res = await apiClient.get(`/documents/${id}/export?format=${format}`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.download = `document.${format}`
      link.click()
    } catch (e) {
      toast.error("Yuklab olishda xato")
    }
  }

  const docTypeLabel = (type: string) => DOC_TYPES.find((d) => d.value === type)?.label || type

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-jeya-text">Hujjatlar</h1>
          <p className="text-jeya-muted text-sm mt-1">AI yordamida hujjatlar yarating va boshqaring</p>
        </div>
        <Button onClick={() => setShowModal(true)} variant="primary">
          <Plus size={16} className="mr-2" />
          Yangi hujjat
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader size={32} className="text-jeya-accent animate-spin" />
        </div>
      ) : documents.length === 0 ? (
        <Card className="text-center py-16">
          <FileText size={48} className="text-jeya-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-jeya-text mb-2">Hujjatlar yo'q</h3>
          <p className="text-jeya-muted text-sm mb-6">AI yordamida birinchi hujjatingizni yarating</p>
          <Button onClick={() => setShowModal(true)} variant="primary">
            <Plus size={16} className="mr-2" />
            Hujjat yaratish
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <Card key={doc.id} hover className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-jeya-text truncate">{doc.title}</h3>
                  <p className="text-xs text-jeya-muted mt-0.5">
                    {docTypeLabel(doc.doc_type)} · {new Date(doc.created_at).toLocaleDateString('uz-UZ')}
                  </p>
                </div>
              </div>
              <p className="text-jeya-muted text-xs line-clamp-3 leading-relaxed">{doc.content}</p>
              <div className="flex items-center gap-2 pt-2 border-t border-jeya-border">
                <button
                  onClick={() => handleExport(doc.id, 'pdf')}
                  className="flex-1 flex items-center justify-center gap-1.5 text-jeya-muted hover:text-jeya-accent text-xs py-1.5 rounded-lg hover:bg-jeya-accent/10 transition-all"
                >
                  <Download size={13} /> PDF
                </button>
                <button
                  onClick={() => handleExport(doc.id, 'docx')}
                  className="flex-1 flex items-center justify-center gap-1.5 text-jeya-muted hover:text-jeya-accent text-xs py-1.5 rounded-lg hover:bg-jeya-accent/10 transition-all"
                >
                  <Download size={13} /> DOCX
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="flex items-center justify-center gap-1.5 text-jeya-muted hover:text-red-400 text-xs py-1.5 px-2 rounded-lg hover:bg-red-500/10 transition-all"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-jeya-text">Yangi hujjat yaratish</h2>
              <button onClick={() => setShowModal(false)} className="text-jeya-muted hover:text-jeya-text">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <Input
                label="Hujjat sarlavhasi"
                placeholder="Masalan: Ish arizasi"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-jeya-text">Hujjat turi</label>
                <select
                  value={form.doc_type}
                  onChange={(e) => setForm({ ...form, doc_type: e.target.value })}
                  className="bg-jeya-card border border-jeya-border text-jeya-text rounded-xl px-4 py-3 text-sm outline-none focus:border-jeya-accent focus:ring-1 focus:ring-jeya-accent"
                >
                  {DOC_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-jeya-text">Hujjat haqida ko'rsatma</label>
                <textarea
                  value={form.prompt}
                  onChange={(e) => setForm({ ...form, prompt: e.target.value })}
                  placeholder="Hujjatda nima bo'lishi kerakligini yozing..."
                  rows={4}
                  className="bg-jeya-card border border-jeya-border text-jeya-text placeholder-jeya-muted rounded-xl px-4 py-3 text-sm outline-none focus:border-jeya-accent focus:ring-1 focus:ring-jeya-accent resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>
                  Bekor qilish
                </Button>
                <Button variant="primary" className="flex-1" isLoading={generating} onClick={handleGenerate}>
                  Yaratish
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
