'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Mic, MicOff, Send, ChevronRight, Activity, Cpu, Wifi, Clock } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { DEMO_MODE, DEMO_USER, DEMO_TOKEN, demoReply } from '@/lib/demo'

const GREET = [
  "Assalomu alaykum. Men JEYA — sizning shaxsiy AI operatoringizman.",
  "Bugun sizga qanday yordam bera olaman?",
]

const SUGGESTIONS = [
  "Bugun ob-havo qanday?",
  "5 haftalik o'quv rejasi tuzib ber",
  "Menga motivatsion iqtibos ayt",
  "Inglizchadan tarjima qil",
]

function useTime() {
  const [t, setT] = useState('')
  useEffect(() => {
    const tick = () => {
      const d = new Date()
      setT(d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return t
}

interface Msg { role: 'user' | 'ai'; text: string }

export default function JarvisPage() {
  const router = useRouter()
  const { isAuthenticated, login } = useAuthStore()
  const time = useTime()
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [booted, setBooted] = useState(false)
  const [bootText, setBootText] = useState('')
  const [activePanel, setActivePanel] = useState<'chat'|'docs'|'memory'|'system'>('chat')
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Boot animatsiyasi
  const BOOT_LINES = [
    'JEYA OS v2.0 initializing...',
    'Loading neural modules... OK',
    'Language model: JEYA-7B... READY',
    'Voice engine: active',
    'System status: OPTIMAL',
    '> Salom. Men tayyor.',
  ]
  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      setBootText(prev => prev + (i > 0 ? '\n' : '') + BOOT_LINES[i])
      i++
      if (i >= BOOT_LINES.length) {
        clearInterval(id)
        setTimeout(() => setBooted(true), 600)
      }
    }, 320)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, loading])

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    if (DEMO_MODE && !isAuthenticated) login(DEMO_TOKEN, DEMO_USER)
    setInput('')
    setMsgs(p => [...p, { role: 'user', text }])
    setLoading(true)
    const reply = demoReply(text)
    const words = reply.split(' ')
    let built = ''
    setMsgs(p => [...p, { role: 'ai', text: '' }])
    for (let i = 0; i < words.length; i++) {
      built += (i === 0 ? '' : ' ') + words[i]
      const snap = built
      setMsgs(p => { const c = [...p]; c[c.length-1] = { role:'ai', text: snap }; return c })
      await new Promise(r => setTimeout(r, 40))
    }
    setLoading(false)
  }

  if (!booted) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center font-mono">
        <div className="border border-cyan-500/40 rounded p-8 max-w-lg w-full" style={{ boxShadow: '0 0 40px rgba(0,229,255,0.15)' }}>
          <div className="text-cyan-400 text-xs mb-4 opacity-60">JEYA ARTIFICIAL INTELLIGENCE SYSTEM</div>
          <pre className="text-cyan-300 text-sm leading-6 whitespace-pre-wrap">{bootText}<span className="animate-pulse">▌</span></pre>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen overflow-hidden font-mono select-none" style={{
      background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,40,60,0.95), #000 70%)',
    }}>
      {/* scan line */}
      <div className="pointer-events-none absolute inset-0 z-50"
        style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,229,255,0.015) 2px, rgba(0,229,255,0.015) 4px)' }} />

      {/* ───── TOP BAR ───── */}
      <div className="absolute top-0 left-0 right-0 h-14 flex items-center justify-between px-8 z-40"
        style={{ borderBottom: '1px solid rgba(0,229,255,0.15)', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)' }}>
        <div className="flex items-center gap-4">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-spin" style={{ animationDuration:'3s', borderTopColor:'transparent' }} />
            <div className="absolute inset-1 rounded-full bg-cyan-400/20 flex items-center justify-center">
              <span className="text-cyan-300 text-[10px] font-bold">J</span>
            </div>
          </div>
          <span className="text-cyan-300 text-lg tracking-[0.3em] font-bold">JEYA</span>
          <span className="text-cyan-500/50 text-xs">AI OPERATOR v2.0</span>
        </div>
        <div className="flex items-center gap-6 text-xs text-cyan-500/70">
          <span className="flex items-center gap-1"><Activity size={12} className="text-green-400" /> ONLINE</span>
          <span className="flex items-center gap-1"><Cpu size={12} /> CPU 12%</span>
          <span className="flex items-center gap-1"><Wifi size={12} /> NET OK</span>
          <span className="flex items-center gap-1 text-cyan-300"><Clock size={12} /> {time}</span>
        </div>
      </div>

      {/* ───── MAIN LAYOUT ───── */}
      <div className="absolute inset-0 pt-14 pb-0 flex">

        {/* LEFT PANEL */}
        <div className="w-56 flex flex-col gap-2 p-3 border-r" style={{ borderColor:'rgba(0,229,255,0.12)', background:'rgba(0,10,20,0.7)' }}>
          <div className="text-cyan-500/50 text-[10px] tracking-widest mb-1 px-2">MODULES</div>
          {([
            ['chat','💬','AI Chat'],
            ['docs','📄','Hujjatlar'],
            ['memory','🧠','Xotira'],
            ['system','⚡','Tizim'],
          ] as const).map(([key, icon, label]) => (
            <button key={key} onClick={() => setActivePanel(key)}
              className="flex items-center gap-3 px-3 py-2.5 rounded text-left transition-all"
              style={{
                background: activePanel === key ? 'rgba(0,229,255,0.12)' : 'transparent',
                border: `1px solid ${activePanel === key ? 'rgba(0,229,255,0.4)' : 'rgba(0,229,255,0.08)'}`,
                color: activePanel === key ? '#00e5ff' : 'rgba(0,229,255,0.5)',
                boxShadow: activePanel === key ? '0 0 12px rgba(0,229,255,0.15)' : 'none',
              }}>
              <span>{icon}</span>
              <span className="text-xs tracking-wider">{label}</span>
              {activePanel === key && <ChevronRight size={10} className="ml-auto" />}
            </button>
          ))}

          <div className="mt-auto border-t pt-3" style={{ borderColor:'rgba(0,229,255,0.1)' }}>
            <div className="text-cyan-500/40 text-[10px] tracking-widest mb-2 px-2">STATUS</div>
            {[['AI YADRO','OPTIMAL','#00ff9d'],['JAVOB','0.8s','#00e5ff'],['ANIQLIK','97.7%','#00ff9d']].map(([l,v,c])=>(
              <div key={l} className="flex justify-between px-2 py-1 text-[11px]">
                <span style={{ color:'rgba(0,229,255,0.4)' }}>{l}</span>
                <span style={{ color: c }}>{v}</span>
              </div>
            ))}
            <div className="mx-2 mt-2 text-[10px] flex items-center gap-1.5" style={{ color:'#00ff9d' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Demo rejimi faol
            </div>
          </div>
        </div>

        {/* CENTER — main */}
        <div className="flex-1 flex flex-col">

          {activePanel === 'chat' && (
            <>
              {/* messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {msgs.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full gap-8">
                    {/* Jarvis ring */}
                    <div className="relative w-44 h-44 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-spin" style={{ animationDuration:'12s' }} />
                      <div className="absolute inset-3 rounded-full border border-cyan-400/30 animate-spin" style={{ animationDuration:'8s', animationDirection:'reverse' }} />
                      <div className="absolute inset-6 rounded-full border-2 border-cyan-400/50 animate-spin" style={{ animationDuration:'5s' }} />
                      <div className="absolute inset-10 rounded-full" style={{ background:'radial-gradient(circle, rgba(0,229,255,0.3), transparent)', animation:'pulse 2s ease-in-out infinite' }} />
                      <span className="text-cyan-300 text-3xl font-bold tracking-widest" style={{ textShadow:'0 0 20px #00e5ff' }}>J</span>
                    </div>
                    <div className="text-center space-y-2">
                      {GREET.map((g,i) => (
                        <p key={i} className="text-cyan-300/80 text-sm" style={{ textShadow:'0 0 10px rgba(0,229,255,0.3)' }}>{g}</p>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2 w-full max-w-lg">
                      {SUGGESTIONS.map(s => (
                        <button key={s} onClick={() => send(s)}
                          className="text-left p-3 rounded text-xs transition-all"
                          style={{ border:'1px solid rgba(0,229,255,0.2)', color:'rgba(0,229,255,0.7)', background:'rgba(0,229,255,0.04)' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(0,229,255,0.5)'; (e.currentTarget as HTMLElement).style.background='rgba(0,229,255,0.1)' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(0,229,255,0.2)'; (e.currentTarget as HTMLElement).style.background='rgba(0,229,255,0.04)' }}>
                          <span style={{ color:'rgba(0,229,255,0.4)' }}>› </span>{s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {msgs.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {m.role === 'ai' && (
                      <div className="w-6 h-6 rounded-full border border-cyan-400/50 flex items-center justify-center mr-2 mt-1 flex-shrink-0" style={{ boxShadow:'0 0 8px rgba(0,229,255,0.3)' }}>
                        <span className="text-cyan-300 text-[9px] font-bold">J</span>
                      </div>
                    )}
                    <div className="max-w-xl rounded px-4 py-3 text-sm leading-relaxed"
                      style={m.role === 'user'
                        ? { background:'rgba(0,229,255,0.1)', border:'1px solid rgba(0,229,255,0.3)', color:'#e0f7ff' }
                        : { background:'rgba(0,255,157,0.05)', border:'1px solid rgba(0,255,157,0.2)', color:'rgba(0,255,157,0.9)' }
                      }>
                      {m.role === 'ai' && <span className="text-cyan-400/50 text-[10px] block mb-1">JEYA ›</span>}
                      {m.text}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-center gap-2 ml-8">
                    <span className="text-cyan-400/50 text-[10px]">JEYA processing</span>
                    {[0,1,2].map(i => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay:`${i*0.15}s` }} />
                    ))}
                  </div>
                )}
                <div ref={endRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t" style={{ borderColor:'rgba(0,229,255,0.15)', background:'rgba(0,0,0,0.5)' }}>
                <div className="flex items-center gap-3 rounded px-4 py-3"
                  style={{ border:'1px solid rgba(0,229,255,0.3)', background:'rgba(0,229,255,0.04)', boxShadow:'0 0 20px rgba(0,229,255,0.08)' }}>
                  <span className="text-cyan-500/60 text-xs">›</span>
                  <input ref={inputRef} value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && send(input)}
                    placeholder="Buyruq yoki savol kiriting..."
                    className="flex-1 bg-transparent outline-none text-sm"
                    style={{ color:'rgba(0,229,255,0.9)', caretColor:'#00e5ff' }}
                    placeholder-class="text-cyan-500/40"
                    autoFocus
                  />
                  <button onClick={() => setListening(l => !l)}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                    style={{ border:`1px solid ${listening ? '#00ff9d' : 'rgba(0,229,255,0.3)'}`, background: listening ? 'rgba(0,255,157,0.15)' : 'transparent' }}>
                    {listening ? <MicOff size={14} style={{ color:'#00ff9d' }} /> : <Mic size={14} style={{ color:'rgba(0,229,255,0.6)' }} />}
                  </button>
                  <button onClick={() => send(input)}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                    style={{ border:'1px solid rgba(0,229,255,0.4)', background:'rgba(0,229,255,0.1)' }}>
                    <Send size={13} style={{ color:'#00e5ff' }} />
                  </button>
                </div>
                <div className="text-center mt-2 text-[10px]" style={{ color:'rgba(0,229,255,0.25)' }}>
                  Enter — yuborish &nbsp;·&nbsp; Demo rejimi yoqilgan
                </div>
              </div>
            </>
          )}

          {activePanel !== 'chat' && (
            <div className="flex-1 flex items-center justify-center flex-col gap-4">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-spin" style={{ animationDuration:'8s' }} />
                <div className="absolute inset-4 rounded-full border border-cyan-400/30 animate-spin" style={{ animationDuration:'5s', animationDirection:'reverse' }} />
                <div className="absolute inset-8 rounded-full" style={{ background:'radial-gradient(circle, rgba(0,229,255,0.25), transparent)' }} />
              </div>
              <div className="text-cyan-400/60 text-sm tracking-widest">
                {activePanel === 'docs' && '[ HUJJATLAR MODULI ]'}
                {activePanel === 'memory' && '[ XOTIRA MODULI ]'}
                {activePanel === 'system' && '[ TIZIM MODULI ]'}
              </div>
              <div className="text-cyan-500/40 text-xs">Backend ulanishini kuting...</div>
              <button onClick={() => setActivePanel('chat')}
                className="text-xs px-4 py-2 rounded transition-all"
                style={{ border:'1px solid rgba(0,229,255,0.3)', color:'#00e5ff' }}>
                ← Chatga qaytish
              </button>
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="w-52 p-3 border-l flex flex-col gap-3" style={{ borderColor:'rgba(0,229,255,0.12)', background:'rgba(0,10,20,0.7)' }}>
          <div className="text-cyan-500/50 text-[10px] tracking-widest px-2">QUICK ACCESS</div>
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => { setActivePanel('chat'); send(s) }}
              className="text-left p-2.5 rounded text-[11px] leading-relaxed transition-all"
              style={{ border:'1px solid rgba(0,229,255,0.12)', color:'rgba(0,229,255,0.6)', background:'transparent' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor='rgba(0,229,255,0.4)'; el.style.color='#00e5ff' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor='rgba(0,229,255,0.12)'; el.style.color='rgba(0,229,255,0.6)' }}>
              <span style={{ color:'rgba(0,229,255,0.3)' }}>›› </span>{s}
            </button>
          ))}

          <div className="mt-auto">
            <div className="text-cyan-500/40 text-[10px] tracking-widest mb-2 px-2">NEURAL LOAD</div>
            {[72, 45, 88, 31].map((v, i) => (
              <div key={i} className="px-2 mb-2">
                <div className="flex justify-between text-[10px] mb-1" style={{ color:'rgba(0,229,255,0.4)' }}>
                  <span>{['NLP','MEM','PROC','NET'][i]}</span>
                  <span style={{ color:'#00ff9d' }}>{v}%</span>
                </div>
                <div className="h-0.5 rounded-full" style={{ background:'rgba(0,229,255,0.1)' }}>
                  <div className="h-full rounded-full" style={{ width:`${v}%`, background:'linear-gradient(90deg,#00e5ff,#00ff9d)', boxShadow:'0 0 6px rgba(0,229,255,0.4)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
