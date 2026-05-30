'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  Mic, PenLine, MessageCircle, Globe2, ClipboardList,
  Zap, ChevronRight, AudioLines, Languages,
} from 'lucide-react'
import JeyaGlobe from '@/components/landing/JeyaGlobe'
import { useAuthStore } from '@/store/authStore'
import { DEMO_MODE, DEMO_USER, DEMO_TOKEN } from '@/lib/demo'

const FEATURES = [
  { icon: PenLine, title: 'Matn yaratish', desc: 'Ijodiy va samarali' },
  { icon: MessageCircle, title: 'Savollarga javob', desc: 'Aniq va tezkor' },
  { icon: Globe2, title: 'Tarjima qilish', desc: "Ko'p tilni qo'llab-quvvatlash" },
  { icon: ClipboardList, title: 'Reja tuzish', desc: 'Avtomatik rejalashtirish' },
]

const QUICK_COMMANDS = [
  "Bugun ob-havo qanday?",
  "Menga iqtibos haqida tushuntir",
  "5 haftalik o'quv reja tuzib ber",
  "Ushbu matnni tarjima qil",
  "Ijodiy g'oya taklif qil",
]

const STATUS = [
  { label: 'AI yadro', value: 'Optimal' },
  { label: 'Tezkor javob', value: '0.8 soniya' },
  { label: 'Aniqlik darajasi', value: '97.7%' },
  { label: 'Foydalanuvchilar', value: '12.4K+' },
]

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, login } = useAuthStore()
  const [text, setText] = useState('')

  // Foydalanuvchini chat sahifasiga yo'naltirish (demo rejimida avto-kirish)
  const go = (prompt?: string) => {
    const q = (prompt ?? text).trim()
    if (DEMO_MODE && !isAuthenticated) {
      login(DEMO_TOKEN, DEMO_USER)
    }
    router.push(q ? `/dashboard/chat?q=${encodeURIComponent(q)}` : '/dashboard/chat')
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden space-bg text-jeya-text">
      <div className="stars absolute inset-0" />

      {/* ===== Logo (yuqori-chap) ===== */}
      <div className="absolute top-5 left-5 z-20">
        <div className="glass-cyan rounded-2xl px-5 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-jeya-cyan to-jeya-emerald flex items-center justify-center font-black text-jeya-dark text-lg shadow-[0_0_18px_rgba(0,229,255,0.6)]">
            J
          </div>
          <span className="font-bold text-2xl tracking-wide neon-text-cyan">JEYA</span>
        </div>
      </div>

      {/* ===== Markaz: globus + sarlavha ===== */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="mt-[-40px]">
          <JeyaGlobe />
        </div>
        <h1 className="jeya-title text-7xl md:text-8xl font-black mt-[-70px]">JEYA</h1>
        <p className="text-lg md:text-xl text-jeya-text/90 mt-3 font-medium">
          Sizning o&apos;zbek tilidagi aqlli yordamchingiz
        </p>
        <p className="text-sm text-jeya-muted mt-1">
          Kelajak muloqotining cheksiz imkoniyatlari
        </p>
      </div>

      {/* ===== Chap-yuqori: JEYA nimani qila oladi? ===== */}
      <div className="absolute top-28 left-5 z-20 w-72">
        <div className="glass-cyan rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-jeya-cyan" />
              <span className="font-semibold text-sm">JEYA nimani qila oladi?</span>
            </div>
            <ChevronRight size={14} className="text-jeya-muted" />
          </div>
          <div className="space-y-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg border border-jeya-cyan/30 bg-jeya-cyan/5 flex items-center justify-center">
                  <f.icon size={16} className="text-jeya-cyan" />
                </div>
                <div>
                  <div className="text-sm font-medium">{f.title}</div>
                  <div className="text-xs text-jeya-muted">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-jeya-border">
            <span className="w-2 h-2 rounded-full bg-jeya-emerald animate-pulse shadow-[0_0_8px_#00ff9d]" />
            <span className="text-xs text-jeya-emerald">Faol va tayyor</span>
          </div>
        </div>
      </div>

      {/* ===== Chap-past: til modeli ===== */}
      <div className="absolute bottom-32 left-5 z-20 w-72">
        <div className="glass-cyan rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-jeya-muted mb-1">Hozirgi til modeli</div>
            <div className="text-2xl font-black neon-text-cyan">JEYA-7B</div>
            <div className="text-xs text-jeya-muted mt-1">Eng so&apos;nggi avlod</div>
            <div className="mt-3 h-1 w-32 rounded-full bg-jeya-border overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-jeya-cyan to-jeya-emerald" />
            </div>
          </div>
          <div className="w-16 h-16 rounded-lg border border-jeya-cyan/20 flex items-center justify-center rotate-45">
            <div className="w-8 h-8 border border-jeya-emerald/40 animate-pulse-slow" />
          </div>
        </div>
      </div>

      {/* ===== O'ng-yuqori: tezkor buyruqlar ===== */}
      <div className="absolute top-28 right-5 z-20 w-80">
        <div className="glass-cyan rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={16} className="text-jeya-emerald" />
            <span className="font-semibold text-sm">Tezkor buyruqlar</span>
          </div>
          <div className="space-y-2">
            {QUICK_COMMANDS.map((c) => (
              <button
                key={c}
                onClick={() => go(c)}
                className="w-full text-left px-3 py-2.5 rounded-lg border border-jeya-border hover:border-jeya-cyan/50 hover:bg-jeya-cyan/5 transition-all flex items-center justify-between group"
              >
                <span className="text-sm text-jeya-text/90">&ldquo;{c}&rdquo;</span>
                <ChevronRight size={14} className="text-jeya-muted group-hover:text-jeya-cyan" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== O'ng-o'rta: tizim holati ===== */}
      <div className="absolute bottom-44 right-5 z-20 w-80">
        <div className="glass-cyan rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AudioLines size={16} className="text-jeya-cyan" />
            <span className="font-semibold text-sm">Tizim holati</span>
          </div>
          <div className="space-y-2">
            {STATUS.map((s) => (
              <div key={s.label} className="flex items-center justify-between text-sm">
                <span className="text-jeya-muted">{s.label}:</span>
                <span className="text-jeya-emerald font-medium">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== O'ng-past: 24/7 ===== */}
      <div className="absolute bottom-32 right-5 z-20 w-80">
        <div className="glass-cyan rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg border border-jeya-emerald/30 bg-jeya-emerald/5 flex items-center justify-center">
            <MessageCircle size={16} className="text-jeya-emerald" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">24/7 faol</div>
            <div className="text-xs text-jeya-muted">Doim siz bilan</div>
          </div>
          <span className="w-2 h-2 rounded-full bg-jeya-emerald animate-pulse shadow-[0_0_8px_#00ff9d]" />
        </div>
      </div>

      {/* ===== Past: ovozli kirish paneli ===== */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-[640px] max-w-[90vw]">
        <div className="glass-cyan rounded-full p-2 pl-4 flex items-center gap-3 shadow-[0_0_40px_rgba(0,229,255,0.15)]">
          <button
            onClick={() => go()}
            className="w-9 h-9 rounded-lg border border-jeya-border flex items-center justify-center hover:border-jeya-cyan/50 transition-colors"
            title="Tarjima"
          >
            <Languages size={16} className="text-jeya-muted" />
          </button>

          {/* chap to'lqin */}
          <div className="flex items-center gap-0.5 h-6">
            {[...Array(9)].map((_, i) => (
              <span key={i} className="wave-bar h-full" style={{ animationDelay: `${i * 0.08}s` }} />
            ))}
          </div>

          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && go()}
            placeholder="Gapirishni boshlang"
            className="flex-1 bg-transparent text-center text-jeya-text placeholder-jeya-muted outline-none text-base"
          />

          {/* o'ng to'lqin */}
          <div className="flex items-center gap-0.5 h-6">
            {[...Array(9)].map((_, i) => (
              <span key={i} className="wave-bar h-full" style={{ animationDelay: `${i * 0.08}s` }} />
            ))}
          </div>

          <button
            onClick={() => go()}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-jeya-cyan to-jeya-emerald flex items-center justify-center shadow-[0_0_24px_rgba(0,229,255,0.5)] hover:scale-105 transition-transform"
            title="Gapirish"
          >
            <Mic size={20} className="text-jeya-dark" />
          </button>
        </div>
      </div>
    </main>
  )
}
