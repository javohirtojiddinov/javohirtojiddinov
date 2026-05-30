import { Message } from '@/store/chatStore'
import { Bot } from 'lucide-react'

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const time = new Date(message.created_at).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className={`flex items-end gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-jeya-accent flex items-center justify-center">
          <Bot size={16} className="text-white" />
        </div>
      )}

      <div className={`max-w-[75%] flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
            isUser
              ? 'bg-jeya-accent text-white rounded-br-sm'
              : 'bg-jeya-card border border-jeya-border text-jeya-text rounded-bl-sm'
          }`}
        >
          {message.content || (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-jeya-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-jeya-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-jeya-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          )}
        </div>
        <span className="text-jeya-muted text-xs">{time}</span>
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-jeya-border flex items-center justify-center text-jeya-text text-xs font-bold">
          S
        </div>
      )}
    </div>
  )
}
