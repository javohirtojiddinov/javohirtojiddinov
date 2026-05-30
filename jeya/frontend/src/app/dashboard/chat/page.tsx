'use client'
import { useEffect, useRef, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useChatStore } from '@/store/chatStore'
import MessageBubble from '@/components/chat/MessageBubble'
import VoiceButton from '@/components/chat/VoiceButton'
import { Send, Plus, MessageSquare, Cpu } from 'lucide-react'

function ChatInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const convIdParam = searchParams.get('id')
  const { conversations, currentConversationId, messages, isLoading, loadConversations, selectConversation, createConversation, sendMessage } = useChatStore()
  const [input, setInput] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  const taRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { loadConversations() }, [])
  useEffect(() => { if (convIdParam && convIdParam !== currentConversationId) selectConversation(convIdParam) }, [convIdParam])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || isLoading) return
    setInput('')
    await sendMessage(text)
  }

  const handleNew = async () => {
    const id = await createConversation()
    router.push(`/dashboard/chat?id=${id}`)
  }

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-56 flex-shrink-0 border-r border-jeya-border flex flex-col bg-jeya-card/30">
        <div className="p-3 border-b border-jeya-border">
          <button onClick={handleNew}
            className="flex items-center gap-2 w-full border border-jeya-emerald/40 text-jeya-emerald text-xs px-3 py-2 rounded-lg hover:bg-jeya-emerald/10 transition-all tracking-wider">
            <Plus size={13} /> YANGI
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {conversations.map((conv) => (
            <button key={conv.id} onClick={() => router.push(`/dashboard/chat?id=${conv.id}`)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                currentConversationId === conv.id
                  ? 'border border-jeya-cyan/30 text-jeya-cyan bg-jeya-cyan/5'
                  : 'text-jeya-muted hover:text-jeya-text hover:bg-jeya-border/30'
              }`}>
              <div className="flex items-center gap-1.5">
                <MessageSquare size={11} className="flex-shrink-0" />
                <span className="truncate">{conv.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full border border-jeya-cyan/30 flex items-center justify-center mb-5"
                style={{ boxShadow: '0 0 30px rgba(0,245,255,0.1)' }}>
                <Cpu size={28} className="text-jeya-cyan" style={{ filter: 'drop-shadow(0 0 8px #00f5ff)' }} />
              </div>
              <h2 className="text-xl font-black mb-2 neon-text-cyan">JEYA tayyor</h2>
              <p className="text-jeya-muted text-sm max-w-xs">Savolingizni yozing yoki ovozda gaplashing</p>
              <div className="mt-5 flex flex-wrap gap-2 justify-center">
                {["Qanday yordam bera olasiz?","O'zbekiston haqida gapirib bering","Menga ariza yozib bering"].map((s) => (
                  <button key={s} onClick={() => setInput(s)}
                    className="border border-jeya-border text-jeya-muted hover:text-jeya-cyan hover:border-jeya-cyan/30 text-xs px-3 py-1.5 rounded-full transition-all">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m) => <MessageBubble key={m.id} message={m} />)}
          {isLoading && messages[messages.length-1]?.role === 'user' && (
            <div className="flex items-end gap-3">
              <div className="w-7 h-7 rounded border border-jeya-cyan/30 flex items-center justify-center">
                <Cpu size={13} className="text-jeya-cyan" />
              </div>
              <div className="glass rounded-xl px-4 py-3">
                <span className="flex gap-1.5">
                  {[0,150,300].map((d) => (
                    <span key={d} className="w-1.5 h-1.5 bg-jeya-cyan rounded-full animate-bounce"
                      style={{ animationDelay: `${d}ms`, boxShadow: '0 0 6px #00f5ff' }} />
                  ))}
                </span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-jeya-border p-4">
          <div className="max-w-4xl mx-auto flex items-end gap-3 glass-cyan rounded-xl p-3">
            <VoiceButton onTranscription={(t) => setInput((p) => p ? p + ' ' + t : t)} />
            <textarea ref={taRef} value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              placeholder="Savolingizni yozing... (Enter — yuborish)" rows={1}
              className="flex-1 bg-transparent text-jeya-text placeholder-jeya-muted/50 text-sm outline-none resize-none max-h-36"
              onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height='auto'; t.style.height=`${Math.min(t.scrollHeight,144)}px` }}
            />
            <button onClick={handleSend} disabled={!input.trim() || isLoading}
              className="w-9 h-9 rounded-lg border border-jeya-cyan/50 text-jeya-cyan flex items-center justify-center hover:bg-jeya-cyan/10 hover:shadow-[0_0_15px_rgba(0,245,255,0.3)] transition-all disabled:opacity-30">
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="w-8 h-8 border-2 border-jeya-cyan/30 border-t-jeya-cyan rounded-full animate-spin" /></div>}>
      <ChatInner />
    </Suspense>
  )
}
