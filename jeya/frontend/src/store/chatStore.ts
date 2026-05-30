import { create } from 'zustand'
import { apiClient } from '@/lib/api'

export interface Message {
  id: string; role: 'user' | 'assistant'; content: string; created_at: string
}
export interface Conversation {
  id: string; title: string; created_at: string; message_count?: number
}

interface ChatState {
  conversations: Conversation[]
  currentConversationId: string | null
  messages: Message[]
  isLoading: boolean
  isRecording: boolean
  loadConversations: () => Promise<void>
  selectConversation: (id: string) => Promise<void>
  createConversation: () => Promise<string>
  sendMessage: (content: string) => Promise<void>
  startRecording: () => Promise<MediaRecorder | null>
  stopRecording: (recorder: MediaRecorder) => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [], currentConversationId: null, messages: [], isLoading: false, isRecording: false,

  loadConversations: async () => {
    try {
      const res = await apiClient.get('/chat/conversations')
      set({ conversations: res.data })
    } catch {}
  },

  selectConversation: async (id) => {
    set({ currentConversationId: id, messages: [] })
    try {
      const res = await apiClient.get(`/chat/conversations/${id}/messages`)
      set({ messages: res.data })
    } catch {}
  },

  createConversation: async () => {
    const res = await apiClient.post('/chat/conversations', { title: 'Yangi suhbat' })
    const conv: Conversation = res.data
    set((s) => ({ conversations: [conv, ...s.conversations], currentConversationId: conv.id, messages: [] }))
    return conv.id
  },

  sendMessage: async (content) => {
    let convId = get().currentConversationId
    if (!convId) convId = await get().createConversation()
    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content, created_at: new Date().toISOString() }
    const asstMsg: Message = { id: `a-${Date.now()}`, role: 'assistant', content: '', created_at: new Date().toISOString() }
    set((s) => ({ messages: [...s.messages, userMsg, asstMsg], isLoading: true }))
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('jeya_token') : ''
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'
      const ws = new WebSocket(`${wsUrl}/api/v1/chat/ws/${convId}?token=${token}`)
      ws.onopen = () => ws.send(JSON.stringify({ content }))
      ws.onmessage = (e) => {
        const data = JSON.parse(e.data)
        if (data.type === 'chunk') {
          set((s) => {
            const msgs = [...s.messages]
            const last = msgs[msgs.length - 1]
            if (last?.role === 'assistant') msgs[msgs.length - 1] = { ...last, content: last.content + data.content }
            return { messages: msgs }
          })
        } else if (data.type === 'done' || data.type === 'error') {
          set({ isLoading: false })
          ws.close()
          get().loadConversations()
        }
      }
      ws.onerror = () => set({ isLoading: false })
      ws.onclose = () => set({ isLoading: false })
    } catch { set({ isLoading: false }) }
  },

  startRecording: async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      set({ isRecording: true })
      return recorder
    } catch { return null }
  },

  stopRecording: (recorder) => {
    recorder.stop()
    recorder.stream.getTracks().forEach((t) => t.stop())
    set({ isRecording: false })
  },
}))
