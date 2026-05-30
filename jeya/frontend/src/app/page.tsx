'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import AIOrb from '@/components/landing/AIOrb'
import { Mic, MessageSquare, FileText, FileSearch, Globe, Brain, Monitor, ArrowRight, ChevronDown, Zap, Shield, Star } from 'lucide-react'

const features = [
  { icon: Mic, title: 'Ovozli muloqot', desc: "O'zbek tilida so'zlang — JEYA tushunadi va ovoz bilan javob beradi", color: 'text-jeya-cyan', border: 'border-jeya-cyan/20' },
  { icon: MessageSquare, title: 'Matnli chat', desc: 'Real-time WebSocket orqali tezkor javoblar, suhbat tarixi saqlanadi', color: 'text-jeya-emerald', border: 'border-jeya-emerald/20' },
  { icon: FileText, title: 'Hujjat yaratish', desc: 'Ariza, xat, hisobot — AI yordamida PDF va DOCX formatida', color: 'text-jeya-cyan', border: 'border-jeya-cyan/20' },
  { icon: FileSearch, title: 'Fayl tahlili', desc: 'PDF, Word va rasmlarni yuklang, JEYA mazmunini tushuntiradi', color: 'text-jeya-emerald', border: 'border-jeya-emerald/20' },
  { icon: Globe, title: 'Web qidiruv', desc: 'Internetdan eng yangi ma\'lumotlarni real vaqtda topadi', color: 'text-jeya-cyan', border: 'border-jeya-cyan/20' },
  { icon: Brain, title: 'Shaxsiy xotira', desc: 'Muhim faktlarni eslab qoladi, keyingi suhbatlarda ishlatadi', color: 'text-jeya-emerald', border: 'border-jeya-emerald/20' },
  { icon: Monitor, title: 'Windows Operator', desc: 'Kompyuteringizni boshqaradigan aqlli desktop agent (MVP demo)', color: 'text-jeya-cyan', border: 'border-jeya-cyan/20' },
]

const steps = [
  { n: '01', title: "Ro'yxatdan o'ting", desc: 'Email bilan tezkor hisob yarating' },
  { n: '02', title: 'JEYA bilan tanishing', desc: 'Chat, hujjat, ovoz — barchasini sinab ko\'ring' },
  { n: '03', title: 'Samaradorlikni oshiring', desc: 'JEYA raqamli operatoringizga aylanadi' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-jeya-dark text-jeya-text overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(0,245,255,0.04) 0%, transparent 60%)' }} />

        {/* Scan line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="scan-line" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="animate-float">
            <AIOrb />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="mt-8">
            <div className="inline-flex items-center gap-2 border border-jeya-cyan/20 rounded-full px-4 py-1.5 text-xs text-jeya-muted tracking-widest mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-jeya-emerald animate-pulse" style={{ boxShadow: '0 0 6px #00ff87' }} />
              WINDOWS 11 • WEB PLATFORM • AI OPERATOR
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight tracking-tight">
              <span className="neon-text-cyan">AQLLI RAQAMLI</span>
              <br />
              <span className="text-jeya-text">OPERATOR</span>
            </h1>

            <p className="text-lg text-jeya-muted max-w-2xl mx-auto mb-8 leading-relaxed">
              JEYA — Windows 11 va web uchun yaratilgan shaxsiy AI operator.
              Buyruqlarni tushunadi, fikrlaydi, reja tuzadi va vazifalarni bosqichma-bosqich bajaradi.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register"
                className="group flex items-center gap-2 border border-jeya-emerald/60 text-jeya-emerald px-8 py-3.5 rounded-lg font-medium hover:bg-jeya-emerald/10 hover:shadow-[0_0_30px_rgba(0,255,135,0.25)] transition-all duration-300">
                Boshlash
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/auth/login"
                className="border border-jeya-border text-jeya-muted px-8 py-3.5 rounded-lg font-medium hover:border-jeya-cyan/30 hover:text-jeya-cyan transition-all duration-300">
                Kirish
              </Link>
            </div>
          </motion.div>

          <div className="absolute bottom-8 animate-bounce">
            <ChevronDown size={22} className="text-jeya-muted" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="text-xs tracking-[0.3em] text-jeya-cyan mb-4">IMKONIYATLAR</div>
            <h2 className="text-4xl font-black">JEYA nima qila oladi?</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className={`glass rounded-xl p-5 border ${f.border} hover:shadow-[0_0_20px_rgba(0,245,255,0.06)] transition-all duration-300 group`}>
                <f.icon size={22} className={`${f.color} mb-3 group-hover:scale-110 transition-transform`}
                  style={{ filter: f.color.includes('cyan') ? 'drop-shadow(0 0 6px #00f5ff)' : 'drop-shadow(0 0 6px #00ff87)' }} />
                <h3 className="font-bold text-jeya-text text-sm mb-1.5">{f.title}</h3>
                <p className="text-jeya-muted text-xs leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-28 px-6 relative">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(0,255,135,0.03) 0%, transparent 60%)' }} />
        <div className="max-w-5xl mx-auto relative">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="text-xs tracking-[0.3em] text-jeya-emerald mb-4">JARAYON</div>
            <h2 className="text-4xl font-black">3 ta qadam</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <motion.div key={s.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="glass-cyan rounded-xl p-6 relative">
                <div className="text-5xl font-black text-jeya-cyan/10 mb-3">{s.n}</div>
                <h3 className="font-bold text-jeya-text mb-2">{s.title}</h3>
                <p className="text-jeya-muted text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center glass-cyan rounded-2xl p-12">
          <h2 className="text-4xl font-black mb-4 neon-text-cyan">Bugun boshlang</h2>
          <p className="text-jeya-muted mb-8">JEYA bilan tanishib ko'ring — bepul</p>
          <Link href="/auth/register"
            className="inline-flex items-center gap-2 border border-jeya-emerald/60 text-jeya-emerald px-10 py-4 rounded-lg font-medium hover:bg-jeya-emerald/10 hover:shadow-[0_0_30px_rgba(0,255,135,0.3)] transition-all">
            Bepul boshlash <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-jeya-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-black tracking-wider neon-text-cyan text-sm">JEYA AI</span>
          <p className="text-jeya-muted text-xs">&copy; 2024 JEYA. Barcha huquqlar himoyalangan.</p>
        </div>
      </footer>
    </div>
  )
}
