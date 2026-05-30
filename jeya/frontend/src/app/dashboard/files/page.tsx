'use client'

import { useEffect, useState, useRef } from 'react'
import { apiClient } from '@/lib/api'
import { Upload, FileText, Image, Trash2, Loader, Search, AlertCircle, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '@/components/ui/Card'

interface File {
  id: string
  filename: string
  file_type: string
  file_size: number
  analysis_status: 'pending' | 'processing' | 'done' | 'error'
  analysis_result?: string
  created_at: string
}

const getFileIcon = (type: string) => {
  if (type.includes('pdf')) return FileText
  if (type.includes('image')) return Image
  return FileText
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function FilesPage() {
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [analyzing, setAnalyzing] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchFiles = async () => {
    try {
      const res = await apiClient.get('/files')
      setFiles(res.data)
    } catch (e) {
      toast.error("Fayllarni yuklashda xato")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchFiles() }, [])

  const handleUpload = async (fileList: FileList) => {
    const file = fileList[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await apiClient.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setFiles((prev) => [res.data, ...prev])
      toast.success("Fayl yuklandi!")
    } catch (e) {
      toast.error("Fayl yuklashda xato")
    } finally {
      setUploading(false)
    }
  }

  const handleAnalyze = async (id: string) => {
    setAnalyzing(id)
    try {
      const res = await apiClient.post(`/files/${id}/analyze`)
      setFiles((prev) => prev.map((f) => f.id === id ? { ...f, ...res.data } : f))
      toast.success("Fayl tahlil qilindi!")
    } catch (e) {
      toast.error("Tahlil qilishda xato")
    } finally {
      setAnalyzing(null)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/files/${id}`)
      setFiles((prev) => prev.filter((f) => f.id !== id))
      toast.success("Fayl o'chirildi")
    } catch (e) {
      toast.error("O'chirishda xato")
    }
  }

  const statusBadge = (status: File['analysis_status']) => {
    const map = {
      pending: { label: "Tahlil kutilmoqda", color: "text-yellow-400 bg-yellow-500/10", icon: AlertCircle },
      processing: { label: "Tahlil qilinmoqda", color: "text-blue-400 bg-blue-500/10", icon: Loader },
      done: { label: "Tahlil tugadi", color: "text-green-400 bg-green-500/10", icon: CheckCircle },
      error: { label: "Xato yuz berdi", color: "text-red-400 bg-red-500/10", icon: AlertCircle },
    }
    const s = map[status]
    return (
      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${s.color}`}>
        <s.icon size={10} className={status === 'processing' ? 'animate-spin' : ''} />
        {s.label}
      </span>
    )
  }

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-jeya-text">Fayllar</h1>
        <p className="text-jeya-muted text-sm mt-1">Fayllarni yuklang va AI yordamida tahlil qiling</p>
      </div>

      {/* Upload area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleUpload(e.dataTransfer.files) }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 mb-8 ${
          dragging ? 'border-jeya-accent bg-jeya-accent/10' : 'border-jeya-border hover:border-jeya-accent/50 hover:bg-jeya-card/50'
        }`}
      >
        <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg" className="hidden" onChange={(e) => e.target.files && handleUpload(e.target.files)} />
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader size={36} className="text-jeya-accent animate-spin" />
            <p className="text-jeya-muted text-sm">Yuklanmoqda...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload size={36} className="text-jeya-muted" />
            <div>
              <p className="text-jeya-text font-medium">Faylni shu yerga torting yoki bosing</p>
              <p className="text-jeya-muted text-sm mt-1">PDF, Word, TXT, rasm fayllari qo'llab-quvvatlanadi</p>
            </div>
          </div>
        )}
      </div>

      {/* File list */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader size={32} className="text-jeya-accent animate-spin" />
        </div>
      ) : files.length === 0 ? (
        <Card className="text-center py-16">
          <Upload size={48} className="text-jeya-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-jeya-text mb-2">Fayllar yo'q</h3>
          <p className="text-jeya-muted text-sm">Birinchi faylingizni yuklang</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {files.map((file) => {
            const Icon = getFileIcon(file.file_type)
            return (
              <Card key={file.id} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-jeya-accent/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-jeya-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-medium text-jeya-text text-sm truncate">{file.filename}</span>
                    {statusBadge(file.analysis_status)}
                  </div>
                  <div className="text-xs text-jeya-muted mt-1">
                    {formatSize(file.file_size)} · {new Date(file.created_at).toLocaleDateString('uz-UZ')}
                  </div>
                  {file.analysis_result && (
                    <p className="text-jeya-muted text-xs mt-2 line-clamp-2 leading-relaxed">{file.analysis_result}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {file.analysis_status === 'pending' && (
                    <button
                      onClick={() => handleAnalyze(file.id)}
                      disabled={analyzing === file.id}
                      className="flex items-center gap-1.5 text-jeya-accent hover:text-jeya-accent-glow text-xs px-3 py-1.5 rounded-lg bg-jeya-accent/10 hover:bg-jeya-accent/20 transition-all disabled:opacity-50"
                    >
                      {analyzing === file.id ? <Loader size={12} className="animate-spin" /> : <Search size={12} />}
                      Tahlil
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="text-jeya-muted hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
