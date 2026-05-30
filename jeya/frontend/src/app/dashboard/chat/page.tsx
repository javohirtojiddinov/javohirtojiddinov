'use client'

import { useEffect, useRef, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useChatStore } from '@/store/chatStore'
import MessageBubble from '@/components/chat/MessageBubble'
import VoiceButton from '@/components/chat/VoiceButton'
import { Send, Plus, MessageSquare, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

function ChatPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const convIdParam = searchParams?.get('id') ?? null

  const {
    conversations,
    currentConversationId,
    messages,
    isLoading,
    loadConversations,
    selectConversation,
    createConversation,
    sendMessage,
  } = useChatStore()

  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (convIdParam && convIdParam !== currentConversationId) {
      selectConversation(convIdParam)
    }
  }, [convIdParam])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || isLoading) return
    setInput('')
    await sendMessage(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleNewChat = async () => {
    const id = await createConversation()
    router.push(`/dashboard/chat?id=${id}`)
  }

  const handleVoiceTranscription = (text: string) => {
    setInput((prev) => prev + (prev ? ' ' : '') + text)
    textareaRef.current?.focus()
  }

  return (
    <div className="flex h-full">
      {/* Conversations sidebar */}
      <div className="w-64 flex-shrink-0 border-r border-jeya-border bg-jeya-card/50 flex flex-col">
        <div className="p-4 border-b border-jeya-border">
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 w-full bg-jeya-accent/20 hover:bg-jeya-accent/30 text-jeya-accent px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-jeya-accent/30"
          >
            <Plus size={16} />
            Yangi suhbat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => router.push(`/dashboard/chat?id=${conv.id}`)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                currentConversationId === conv.id
                  ? 'bg-jeya-accent/20 text-jeya-accent border border-jeya-accent/30'
                  : 'text-jeya-muted hover:text-jeya-text hover:bg-jeya-border/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare size={14} className="flex-shrink-0" />
                <span className="truncate">{conv.title}</span>
              </div>
              <div className="text-xs text-jeya-muted/60 mt-1 ml-5">
                {new Date(conv.created_at).toLocaleDateString('uz-UZ')}
              </div>
            </button>
          ))}
          {conversations.length === 0 && (
            <div className="text-center py-8 text-jeya-muted text-xs">
              Hali suhbatlar yo'q
            </div>
          )}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && !currentConversationId && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-jeya-accent/20 border border-jeya-accent/30 flex items-center justify-center mb-6">
                <MessageSquare size={36} className="text-jeya-accent" />
              </div>
              <h2 className="text-2xl font-bold text-jeya-text mb-3">JEYA bilan gaplashing</h2>
              <p className="text-jeya-muted max-w-sm text-sm leading-relaxed">
                Savolingizni yozing yoki mikrofon tugmasini bosib ovozda gaplashing.
                JEYA o'zbek tilida javob beradi.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                {[
                  "Qanday yordam bera olasiz?",
                  "O'zbekiston tarixi haqida gapirib bering",
                  "Ingliz tilidagi xatlarni tarjima qiling",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="glass text-jeya-muted hover:text-jeya-accent hover:border-jeya-accent/50 text-xs px-4 py-2 rounded-full transition-all duration-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex items-end gap-3">
              <div className="w-8 h-8 rounded-full bg-jeya-accent flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">J</span>
              </div>
              <div className="bg-jeya-card border border-jeya-border rounded-2xl rounded-bl-sm px-4 py-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-jeya-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-jeya-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-jeya-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-jeya-border bg-jeya-card/30 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-3 glass rounded-2xl p-3">
              <VoiceButton onTranscription={handleVoiceTranscription} />

              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Savolingizni yozing... (Enter — yuborish, Shift+Enter — yangi qator)"
                rows={1}
                className="flex-1 bg-transparent text-jeya-text placeholder-jeya-muted text-sm outline-none resize-none max-h-40 leading-relaxed"
                style={{ minHeight: '24px' }}
                onInput={(e) => {
                  const t = e.target as HTMLTextAreaElement
                  t.style.height = 'auto'
                  t.style.height = `${Math.min(t.scrollHeight, 160)}px`
                }}
              />

              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="flex-shrink-0 w-10 h-10 rounded-full bg-jeya-accent hover:bg-jeya-accent-glow text-white flex items-center justify-center transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-center text-xs text-jeya-muted mt-2">
              JEYA xato qilishi mumkin. Muhim ma'lumotlarni tekshirib ko'ring.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="w-8 h-8 border-2 border-jeya-accent border-t-transparent rounded-full animate-spin" /></div>}>
      <ChatPageInner />
    </Suspense>
  )
}
