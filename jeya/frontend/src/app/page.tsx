'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import OrbAnimation from '@/components/landing/OrbAnimation'
import FeatureCard from '@/components/landing/FeatureCard'
import {
  Mic,
  MessageSquare,
  FileText,
  FileSearch,
  Globe,
  Brain,
  ArrowRight,
  ChevronDown,
  Zap,
  Shield,
  Star,
} from 'lucide-react'

const features = [
  {
    icon: Mic,
    title: "Ovozli muloqot",
    description: "O'zbek tilida so'zlang — JEYA sizni tushunib, ovoz bilan javob beradi. Tabiiy va qulay suhbat tajribasi.",
    gradient: "from-purple-500 to-indigo-500",
  },
  {
    icon: MessageSquare,
    title: "Matnli chat",
    description: "Istalgan savolingizni yozing. JEYA tezkor va aniq javoblar beradi. Kecha va bugun bo'lgan suhbatlaringiz saqlanadi.",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    icon: FileText,
    title: "Hujjat yaratish",
    description: "Ariza, xat, rezyume, hisobot — istalgan hujjatni bir necha soniyada yarating. PDF va DOCX formatlarida yuklab oling.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: FileSearch,
    title: "Fayl tahlili",
    description: "PDF, Word, rasmlarni yuklang — JEYA mazmunni o'qib, savollarga javob beradi va qisqacha xulosalar chiqaradi.",
    gradient: "from-cyan-500 to-teal-500",
  },
  {
    icon: Globe,
    title: "Web qidiruv",
    description: "Internetdan eng yangi ma'lumotlarni topadi. Yangiliklar, qo'llanmalar, ilmiy maqolalar — barchasi bir joyda.",
    gradient: "from-teal-500 to-green-500",
  },
  {
    icon: Brain,
    title: "Shaxsiy xotira",
    description: "JEYA siz haqingizda muhim ma'lumotlarni eslab qoladi: ismingiz, sevimli mavzularingiz, oldingi suhbatlar.",
    gradient: "from-green-500 to-emerald-500",
  },
]

const steps = [
  {
    number: "01",
    title: "Ro'yxatdan o'ting",
    description: "Elektron pochtangiz bilan tezkor ro'yxatdan o'ting. Hech qanday kredit karta kerak emas.",
  },
  {
    number: "02",
    title: "JEYA bilan tanishing",
    description: "Suhbat boshlang, savollar bering, hujjatlar yarating. Interfeysimiz juda oddiy.",
  },
  {
    number: "03",
    title: "Natijani ko'ring",
    description: "JEYA sizning yordamchingizga aylanadi — vaqtingizni tejab, ishingizni osonlashtiradi.",
  },
]

export default function HomePage() {
  const featuresRef = useRef<HTMLElement>(null)

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-jeya-dark text-jeya-text overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(99,102,241,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(99,102,241,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <OrbAnimation />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-jeya-muted mb-8 border border-jeya-border">
              <Zap size={14} className="text-jeya-accent" />
              <span>O'zbek tilidagi birinchi AI yordamchi</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-jeya-text">O'zbek tilida</span>
              <br />
              <span className="bg-gradient-to-r from-jeya-accent to-jeya-accent-glow bg-clip-text text-transparent">
                siz bilan gaplashadigan
              </span>
              <br />
              <span className="text-jeya-text">AI yordamchi</span>
            </h1>

            <p className="text-xl text-jeya-muted max-w-2xl mx-auto mb-10">
              JEYA — ovoz va matn orqali muloqot qiluvchi, hujjat yarataydigan,
              fayllarni tahlil qiluvchi va internetdan ma'lumot izlaydigan sun'iy intellekt platformasi.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/register"
                className="group flex items-center gap-2 bg-jeya-accent hover:bg-jeya-accent-glow text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]"
              >
                Boshlash
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={scrollToFeatures}
                className="flex items-center gap-2 glass text-jeya-text hover:text-jeya-accent px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
              >
                Ko'proq bilish
                <ChevronDown size={20} className="animate-bounce" />
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 grid grid-cols-3 gap-8 max-w-xl mx-auto"
          >
            {[
              { value: '6+', label: "AI qobiliyat" },
              { value: '99%', label: "Aniqlik darajasi" },
              { value: '24/7', label: "Ishlash vaqti" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-jeya-accent">{stat.value}</div>
                <div className="text-sm text-jeya-muted mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown size={24} className="text-jeya-muted" />
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              JEYA nima qila oladi?
            </h2>
            <p className="text-xl text-jeya-muted max-w-2xl mx-auto">
              Bir platformada barcha kerakli sun'iy intellekt imkoniyatlari —
              o'zbek tilida.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 orb-gradient opacity-30" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Qanday ishlaydi?</h2>
            <p className="text-xl text-jeya-muted">3 ta oddiy qadam bilan boshlang</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="glass rounded-2xl p-8 relative"
              >
                <div className="text-6xl font-black text-jeya-accent/20 mb-4">{step.number}</div>
                <h3 className="text-xl font-bold mb-3 text-jeya-text">{step.title}</h3>
                <p className="text-jeya-muted leading-relaxed">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 z-10">
                    <ArrowRight size={24} className="text-jeya-accent" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Xavfsiz", desc: "Barcha ma'lumotlaringiz shifrlangan va xavfsiz saqlanadi" },
              { icon: Zap, title: "Tez", desc: "Sekundlar ichida javob oling — hech qanday kutish yo'q" },
              { icon: Star, title: "Sifatli", desc: "Eng zamonaviy AI texnologiyalari asosida qurilgan" },
            ].map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="glass rounded-xl p-6 flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-full bg-jeya-accent/20 flex items-center justify-center mb-4">
                  <item.icon size={24} className="text-jeya-accent" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-jeya-muted text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="glass rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 orb-gradient opacity-50" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Bugun boshlang
              </h2>
              <p className="text-xl text-jeya-muted mb-10">
                JEYA bilan tanishib ko'ring — bepul, hech qanday kredit karta talab qilinmaydi.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/auth/register"
                  className="group flex items-center gap-2 bg-jeya-accent hover:bg-jeya-accent-glow text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-[0_0_40px_rgba(99,102,241,0.6)]"
                >
                  Bepul boshlash
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/auth/login"
                  className="glass text-jeya-text hover:text-jeya-accent px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
                >
                  Kirish
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-jeya-border py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-jeya-accent flex items-center justify-center text-white font-black text-sm">
                J
              </div>
              <span className="font-bold text-jeya-text">JEYA</span>
              <span className="text-jeya-muted text-sm">— O'zbek AI Yordamchisi</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-jeya-muted">
              <Link href="#" className="hover:text-jeya-accent transition-colors">Maxfiylik siyosati</Link>
              <Link href="#" className="hover:text-jeya-accent transition-colors">Foydalanish shartlari</Link>
              <Link href="#" className="hover:text-jeya-accent transition-colors">Aloqa</Link>
            </div>
            <div className="text-sm text-jeya-muted">
              &copy; 2024 JEYA. Barcha huquqlar himoyalangan.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
