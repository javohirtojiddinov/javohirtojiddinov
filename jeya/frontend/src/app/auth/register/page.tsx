'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { apiClient } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Cpu, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [form, setForm] = useState({ full_name: '', email: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.full_name.trim()) e.full_name = 'Ism kiritish majburiy'
    if (!form.email) e.email = 'Email kiritish majburiy'
    if (!form.password || form.password.length < 8) e.password = 'Parol kamida 8 ta belgi'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const res = await apiClient.post('/auth/register', form)
      login(res.data.access_token, res.data.user)
      toast.success('Hisob yaratildi!')
      router.push('/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Ro'yxatdan o'tish xatosi")
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-jeya-dark grid-bg flex items-center justify-center px-4">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(0,255,135,0.04) 0%, transparent 60%)' }} />
      <div className="relative w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg border border-jeya-emerald/50 flex items-center justify-center"
              style={{ boxShadow: '0 0 20px rgba(0,255,135,0.2)' }}>
              <Cpu size={20} className="text-jeya-emerald" />
            </div>
            <span className="font-black text-2xl tracking-wider neon-text-cyan">JEYA</span>
          </Link>
        </div>
        <div className="glass-cyan rounded-2xl p-8">
          <div className="text-xs tracking-[0.3em] text-jeya-muted mb-2">YANGI HISOB</div>
          <h1 className="text-2xl font-black text-jeya-text mb-6">Ro'yxatdan o'tish</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="To'liq ism" placeholder="Ism Familiya" value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })} error={errors.full_name} />
            <Input label="Email" type="email" placeholder="siz@example.com" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
            <div className="relative">
              <Input label="Parol" type={showPass ? 'text' : 'password'} placeholder="Kamida 8 ta belgi"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 bottom-3 text-jeya-muted hover:text-jeya-cyan transition-colors">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <Button type="submit" variant="emerald" size="lg" isLoading={loading} className="w-full">Ro'yxatdan o'tish</Button>
          </form>
          <p className="text-center text-xs text-jeya-muted mt-6">
            Hisobingiz bormi?{' '}
            <Link href="/auth/login" className="text-jeya-cyan hover:underline">Kirish</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
