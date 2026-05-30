'use client'

import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { apiClient } from '@/lib/api'
import toast from 'react-hot-toast'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Settings, User, Lock, Bell } from 'lucide-react'

export default function SettingsPage() {
  const { user, setUser } = useAuthStore()
  const [profile, setProfile] = useState({ full_name: user?.full_name || '', email: user?.email || '' })
  const [password, setPassword] = useState({ current: '', new: '', confirm: '' })
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  const handleSaveProfile = async () => {
    setSavingProfile(true)
    try {
      const res = await apiClient.patch('/auth/me', { full_name: profile.full_name })
      setUser(res.data)
      toast.success("Profil yangilandi")
    } catch (e) {
      toast.error("Profilni saqlashda xato")
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async () => {
    if (password.new !== password.confirm) {
      toast.error("Yangi parollar mos kelmaydi")
      return
    }
    if (password.new.length < 8) {
      toast.error("Parol kamida 8 ta belgi bo'lishi kerak")
      return
    }
    setSavingPassword(true)
    try {
      await apiClient.post('/auth/change-password', {
        current_password: password.current,
        new_password: password.new,
      })
      setPassword({ current: '', new: '', confirm: '' })
      toast.success("Parol o'zgartirildi")
    } catch (e: any) {
      toast.error(e.response?.data?.detail || "Parol o'zgartirishda xato")
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-jeya-text flex items-center gap-3">
          <Settings size={24} className="text-jeya-accent" />
          Sozlamalar
        </h1>
        <p className="text-jeya-muted text-sm mt-1">Hisob va xavfsizlik sozlamalari</p>
      </div>

      {/* Profile section */}
      <Card className="mb-6">
        <h2 className="text-lg font-semibold text-jeya-text mb-5 flex items-center gap-2">
          <User size={18} className="text-jeya-accent" />
          Profil ma'lumotlari
        </h2>
        <div className="space-y-4">
          <Input
            label="To'liq ism"
            value={profile.full_name}
            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
          />
          <Input
            label="Email"
            value={profile.email}
            disabled
            className="opacity-60 cursor-not-allowed"
          />
          <Button variant="primary" isLoading={savingProfile} onClick={handleSaveProfile}>
            Saqlash
          </Button>
        </div>
      </Card>

      {/* Password section */}
      <Card>
        <h2 className="text-lg font-semibold text-jeya-text mb-5 flex items-center gap-2">
          <Lock size={18} className="text-jeya-accent" />
          Parolni o'zgartirish
        </h2>
        <div className="space-y-4">
          <Input
            label="Joriy parol"
            type="password"
            value={password.current}
            onChange={(e) => setPassword({ ...password, current: e.target.value })}
            placeholder="Joriy parolni kiriting"
          />
          <Input
            label="Yangi parol"
            type="password"
            value={password.new}
            onChange={(e) => setPassword({ ...password, new: e.target.value })}
            placeholder="Kamida 8 ta belgi"
          />
          <Input
            label="Yangi parolni tasdiqlang"
            type="password"
            value={password.confirm}
            onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
            placeholder="Parolni qayta kiriting"
          />
          <Button variant="primary" isLoading={savingPassword} onClick={handleChangePassword}>
            Parolni o'zgartirish
          </Button>
        </div>
      </Card>
    </div>
  )
}
