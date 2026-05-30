import { create } from 'zustand'
import { apiClient } from '@/lib/api'
import { DEMO_MODE, demoReply, DEMO_CONVERSATIONS } from '@/lib/demo'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface Conversation {
  id: string
  title: string
  created_at: string
  message_count?: number
}

interface ChatState {
  conversations: Conversation[]
  currentConversationId: string | null
  messages: Message[]
  isLoading: boolean
  isRecording: boolean
  ws: WebSocket | null

  loadConversations: () => Promise<void>
  selectConversation: (id: string) => Promise<void>
  createConversation: () => Promise<string>
  sendMessage: (content: string) => Promise<void>
  addMessage: (message: Message) => void
  setIsLoading: (v: boolean) => void
  startRecording: () => Promise<MediaRecorder | null>
  stopRecording: (recorder: MediaRecorder) => void
  connectWebSocket: (conversationId: string, onChunk: (chunk: string) => void) => void
  disconnectWebSocket: () => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  currentConversationId: null,
  messages: [],
  isLoading: false,
  isRecording: false,
  ws: null,

  loadConversations: async () => {
    if (DEMO_MODE) {
      set((s) => ({ conversations: s.conversations.length ? s.conversations : DEMO_CONVERSATIONS }))
      return
    }
    try {
      const res = await apiClient.get('/chat/conversations')
      set({ conversations: res.data })
    } catch (e) {
      console.error('loadConversations error', e)
    }
  },

  selectConversation: async (id: string) => {
    set({ currentConversationId: id, messages: [] })
    if (DEMO_MODE) return
    try {
      const res = await apiClient.get(`/chat/conversations/${id}/messages`)
      set({ messages: res.data })
    } catch (e) {
      console.error('selectConversation error', e)
    }
  },

  createConversation: async () => {
    if (DEMO_MODE) {
      const conv: Conversation = {
        id: `demo-${Date.now()}`,
        title: 'Yangi suhbat',
        created_at: new Date().toISOString(),
        message_count: 0,
      }
      set((state) => ({ conversations: [conv, ...state.conversations], currentConversationId: conv.id, messages: [] }))
      return conv.id
    }
    const res = await apiClient.post('/chat/conversations', { title: 'Yangi suhbat' })
    const conv: Conversation = res.data
    set((state) => ({ conversations: [conv, ...state.conversations], currentConversationId: conv.id, messages: [] }))
    return conv.id
  },

  sendMessage: async (content: string) => {
    const state = get()
    let convId = state.currentConversationId
    if (!convId) {
      convId = await get().createConversation()
    }

    const userMsg: Message = {
      id: `tmp-${Date.now()}`,
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    }
    set((s) => ({ messages: [...s.messages, userMsg], isLoading: true }))

    const assistantMsg: Message = {
      id: `tmp-assistant-${Date.now()}`,
      role: 'assistant',
      content: '',
      created_at: new Date().toISOString(),
    }
    set((s) => ({ messages: [...s.messages, assistantMsg] }))

    if (DEMO_MODE) {
      // So'z-so'z oqim bilan demo javobni imitatsiya qilish
      const reply = demoReply(content)
      const words = reply.split(' ')
      let i = 0
      await new Promise<void>((resolve) => {
        const timer = setInterval(() => {
          if (i >= words.length) {
            clearInterval(timer)
            set({ isLoading: false })
            resolve()
            return
          }
          const chunk = (i === 0 ? '' : ' ') + words[i]
          set((s) => {
            const msgs = [...s.messages]
            const last = msgs[msgs.length - 1]
            if (last && last.role === 'assistant') {
              msgs[msgs.length - 1] = { ...last, content: last.content + chunk }
            }
            return { messages: msgs }
          })
          i++
        }, 45)
      })
      return
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('jeya_token') : ''
      const wsUrl = (process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000')
      const ws = new WebSocket(`${wsUrl}/api/v1/chat/ws/${convId}?token=${token}`)

      ws.onopen = () => {
        ws.send(JSON.stringify({ content }))
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.type === 'chunk') {
          set((s) => {
            const msgs = [...s.messages]
            const last = msgs[msgs.length - 1]
            if (last && last.role === 'assistant') {
              msgs[msgs.length - 1] = { ...last, content: last.content + data.content }
            }
            return { messages: msgs }
          })
        } else if (data.type === 'done') {
          set({ isLoading: false })
          ws.close()
          get().loadConversations()
        } else if (data.type === 'error') {
          set({ isLoading: false })
          ws.close()
        }
      }

      ws.onerror = () => {
        set({ isLoading: false })
      }

      ws.onclose = () => {
        set({ isLoading: false })
      }

      set({ ws })
    } catch (e) {
      console.error('sendMessage error', e)
      set({ isLoading: false })
    }
  },

  addMessage: (message) => {
    set((s) => ({ messages: [...s.messages, message] }))
  },

  setIsLoading: (v) => set({ isLoading: v }),

  startRecording: async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      set({ isRecording: true })
      return recorder
    } catch (e) {
      console.error('Mikrofon xatosi:', e)
      return null
    }
  },

  stopRecording: (recorder) => {
    recorder.stop()
    recorder.stream.getTracks().forEach((t) => t.stop())
    set({ isRecording: false })
  },

  connectWebSocket: (conversationId, onChunk) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('jeya_token') : ''
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'
    const ws = new WebSocket(`${wsUrl}/api/v1/chat/ws/${conversationId}?token=${token}`)
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data)
      if (data.type === 'chunk') onChunk(data.content)
    }
    set({ ws })
  },

  disconnectWebSocket: () => {
    const { ws } = get()
    if (ws) ws.close()
    set({ ws: null })
  },
}))
