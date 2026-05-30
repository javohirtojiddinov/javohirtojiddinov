'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { apiClient } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.email) e.email = "Email kiritish majburiy"
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Email noto'g'ri formatda"
    if (!form.password) e.password = "Parol kiritish majburiy"
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const res = await apiClient.post('/auth/login', form)
      login(res.data.access_token, res.data.user)
      toast.success("Xush kelibsiz!")
      router.push('/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Kirish xatosi")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-jeya-dark flex items-center justify-center px-4">
      <div className="absolute inset-0 orb-gradient opacity-30 pointer-events-none" />
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-jeya-accent flex items-center justify-center text-white font-black text-lg shadow-[0_0_20px_rgba(99,102,241,0.5)]">
              J
            </div>
            <span className="font-bold text-2xl text-jeya-text">JEYA</span>
          </Link>
        </div>

        <div className="glass rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-jeya-text mb-2">Kirish</h1>
          <p className="text-jeya-muted text-sm mb-8">Hisobingizga kiring</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="siz@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
              autoComplete="email"
            />

            <div className="relative">
              <Input
                label="Parol"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={errors.password}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 bottom-3 text-jeya-muted hover:text-jeya-text transition-colors"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button type="submit" variant="primary" size="lg" isLoading={loading} className="w-full">
              Kirish
            </Button>
          </form>

          <p className="text-center text-sm text-jeya-muted mt-6">
            Hisobingiz yo'qmi?{' '}
            <Link href="/auth/register" className="text-jeya-accent hover:text-jeya-accent-glow transition-colors font-medium">
              Ro'yxatdan o'ting
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
