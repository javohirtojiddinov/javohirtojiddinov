'use client'
import { useState, useRef } from 'react'
import { Mic, Square } from 'lucide-react'
import { useChatStore } from '@/store/chatStore'
import { apiClient } from '@/lib/api'
import toast from 'react-hot-toast'

export default function VoiceButton({ onTranscription }: { onTranscription: (t: string) => void }) {
  const { isRecording, startRecording, stopRecording } = useChatStore()
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const handlePress = async () => {
    if (isRecording) {
      if (recorderRef.current) {
        recorderRef.current.onstop = async () => {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
          chunksRef.current = []
          const fd = new FormData()
          fd.append('audio', blob, 'recording.webm')
          try {
            const res = await apiClient.post('/voice/stt', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
            if (res.data.text) onTranscription(res.data.text)
          } catch { toast.error('Ovozni matnга aylantirish xatosi') }
        }
        stopRecording(recorderRef.current)
        recorderRef.current = null
      }
    } else {
      const recorder = await startRecording()
      if (!recorder) { toast.error('Mikrofonga ruxsat berilmagan'); return }
      recorderRef.current = recorder
      chunksRef.current = []
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      recorder.start(100)
    }
  }

  return (
    <button onClick={handlePress} title={isRecording ? "To'xtatish" : 'Ovoz yozish'}
      className={`relative flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${
        isRecording
          ? 'border border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
          : 'border border-jeya-border text-jeya-muted hover:border-jeya-cyan/50 hover:text-jeya-cyan'
      }`}>
      {isRecording && <span className="absolute inset-0 rounded-lg bg-red-500/20 animate-ping" />}
      {isRecording ? <Square size={13} className="fill-red-400" /> : <Mic size={15} />}
    </button>
  )
}
