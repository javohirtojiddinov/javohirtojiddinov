'use client'

import { useState, useRef } from 'react'
import { Mic, MicOff, Square } from 'lucide-react'
import { useChatStore } from '@/store/chatStore'
import { apiClient } from '@/lib/api'
import toast from 'react-hot-toast'

interface VoiceButtonProps {
  onTranscription: (text: string) => void
}

export default function VoiceButton({ onTranscription }: VoiceButtonProps) {
  const { isRecording, startRecording, stopRecording } = useChatStore()
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const handlePress = async () => {
    if (isRecording) {
      // Stop
      if (recorderRef.current) {
        recorderRef.current.onstop = async () => {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
          chunksRef.current = []
          const formData = new FormData()
          formData.append('audio', blob, 'recording.webm')
          try {
            const res = await apiClient.post('/voice/stt', formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            })
            if (res.data.text) {
              onTranscription(res.data.text)
            }
          } catch (e) {
            toast.error("Ovozni matnга aylantirish xatosi")
          }
        }
        stopRecording(recorderRef.current)
        recorderRef.current = null
      }
    } else {
      // Start
      const recorder = await startRecording()
      if (!recorder) {
        toast.error("Mikrofonga ruxsat berilmagan")
        return
      }
      recorderRef.current = recorder
      chunksRef.current = []
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      recorder.start(100)
    }
  }

  return (
    <button
      onClick={handlePress}
      title={isRecording ? "Yozishni to'xtatish" : "Ovoz yozish"}
      className={`relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
        isRecording
          ? 'bg-red-600 hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.6)]'
          : 'bg-jeya-card border border-jeya-border hover:border-jeya-accent text-jeya-muted hover:text-jeya-accent'
      }`}
    >
      {isRecording && (
        <span className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-30" />
      )}
      {isRecording ? (
        <Square size={14} className="text-white fill-white" />
      ) : (
        <Mic size={16} />
      )}
    </button>
  )
}
