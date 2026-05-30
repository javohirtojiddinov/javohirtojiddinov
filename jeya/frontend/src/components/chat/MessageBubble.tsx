import { Message } from '@/store/chatStore'
import { Cpu } from 'lucide-react'

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  const time = new Date(message.created_at).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
  return (
    <div className={`flex items-end gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded border border-jeya-cyan/40 flex items-center justify-center"
          style={{ boxShadow: '0 0 8px rgba(0,245,255,0.2)' }}>
          <Cpu size={13} className="text-jeya-cyan" />
        </div>
      )}
      <div className={`max-w-[75%] flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-4 py-3 rounded-xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
          isUser
            ? 'bg-jeya-cyan/10 border border-jeya-cyan/30 text-jeya-text rounded-br-sm'
            : 'bg-jeya-card border border-jeya-border text-jeya-text rounded-bl-sm'
        }`}>
          {message.content || (
            <span className="flex items-center gap-1.5">
              {[0,150,300].map((d) => (
                <span key={d} className="w-1.5 h-1.5 bg-jeya-cyan rounded-full animate-bounce"
                  style={{ animationDelay: `${d}ms`, boxShadow: '0 0 6px #00f5ff' }} />
              ))}
            </span>
          )}
        </div>
        <span className="text-jeya-muted text-xs">{time}</span>
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded border border-jeya-border flex items-center justify-center text-jeya-muted text-xs font-bold">
          S
        </div>
      )}
    </div>
  )
}
