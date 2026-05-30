'use client'
import { useEffect, useState, useRef } from 'react'
import { apiClient } from '@/lib/api'
import { Upload, FileText, Trash2, Loader, Search, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '@/components/ui/Card'

interface FileItem { id: string; filename: string; file_type: string; file_size: number; analysis_status: string; analysis_result?: string; created_at: string }

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [analyzing, setAnalyzing] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    apiClient.get('/files').then((r) => setFiles(r.data)).catch(() => toast.error('Yuklash xatosi')).finally(() => setLoading(false))
  }, [])

  const upload = async (fl: FileList) => {
    const f = fl[0]; if (!f) return
    setUploading(true)
    const fd = new FormData(); fd.append('file', f)
    try {
      const r = await apiClient.post('/files/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setFiles((p) => [r.data, ...p]); toast.success('Fayl yuklandi!')
    } catch { toast.error('Yuklash xatosi') } finally { setUploading(false) }
  }

  const analyze = async (id: string) => {
    setAnalyzing(id)
    try {
      const r = await apiClient.post(`/files/${id}/analyze`)
      setFiles((p) => p.map((f) => f.id === id ? { ...f, ...r.data } : f))
      toast.success('Tahlil tugadi!')
    } catch { toast.error('Tahlil xatosi') } finally { setAnalyzing(null) }
  }

  const del = async (id: string) => {
    await apiClient.delete(`/files/${id}`).catch(() => {})
    setFiles((p) => p.filter((f) => f.id !== id)); toast.success("O'chirildi")
  }

  const fmt = (b: number) => b < 1024 ? `${b}B` : b < 1048576 ? `${(b/1024).toFixed(1)}KB` : `${(b/1048576).toFixed(1)}MB`

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <div className="text-xs tracking-[0.3em] text-jeya-cyan mb-1">FAYLLAR</div>
        <h1 className="text-2xl font-black">Fayl tahlili</h1>
      </div>

      <div onDragOver={(e) => { e.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); upload(e.dataTransfer.files) }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all mb-8 ${
          dragging ? 'border-jeya-cyan bg-jeya-cyan/5 shadow-[0_0_20px_rgba(0,245,255,0.1)]' : 'border-jeya-border hover:border-jeya-cyan/40'
        }`}>
        <input ref={inputRef} type="file" className="hidden" onChange={(e) => e.target.files && upload(e.target.files)} />
        {uploading ? <Loader size={28} className="text-jeya-cyan animate-spin mx-auto" />
          : <><Upload size={28} className="text-jeya-muted mx-auto mb-3" />
            <p className="text-jeya-text text-sm font-medium">Faylni shu yerga torting yoki bosing</p>
            <p className="text-jeya-muted text-xs mt-1">PDF, Word, TXT, rasm</p></>}
      </div>

      {loading ? <div className="flex justify-center py-12"><Loader className="text-jeya-cyan animate-spin" size={24} /></div>
        : files.length === 0 ? <Card className="text-center py-12"><Upload size={32} className="text-jeya-muted mx-auto mb-3" /><p className="text-jeya-muted text-sm">Fayllar yo'q</p></Card>
        : <div className="space-y-3">{files.map((f) => (
          <Card key={f.id} className="flex items-start gap-4">
            <FileText size={16} className="text-jeya-cyan mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-jeya-text text-sm">{f.filename}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  f.analysis_status === 'done' ? 'border-jeya-emerald/30 text-jeya-emerald' :
                  f.analysis_status === 'error' ? 'border-red-500/30 text-red-400' : 'border-jeya-muted/30 text-jeya-muted'
                }`}>{f.analysis_status === 'done' ? 'Tahlil tugadi' : f.analysis_status === 'error' ? 'Xato' : 'Kutilmoqda'}</span>
              </div>
              <p className="text-jeya-muted text-xs mt-0.5">{fmt(f.file_size)} · {new Date(f.created_at).toLocaleDateString('uz-UZ')}</p>
              {f.analysis_result && <p className="text-jeya-muted text-xs mt-2 line-clamp-2">{f.analysis_result}</p>}
            </div>
            <div className="flex gap-2">
              {f.analysis_status === 'pending' && (
                <button onClick={() => analyze(f.id)} disabled={analyzing === f.id}
                  className="border border-jeya-cyan/30 text-jeya-cyan text-xs px-3 py-1.5 rounded-lg hover:bg-jeya-cyan/10 flex items-center gap-1 transition-all disabled:opacity-40">
                  {analyzing === f.id ? <Loader size={11} className="animate-spin" /> : <Search size={11} />} Tahlil
                </button>
              )}
              <button onClick={() => del(f.id)} className="text-jeya-muted hover:text-red-400 p-1.5 rounded hover:bg-red-500/10 transition-all">
                <Trash2 size={14} />
              </button>
            </div>
          </Card>
        ))}</div>}
    </div>
  )
}
