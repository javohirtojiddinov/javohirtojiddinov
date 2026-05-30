'use client'
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { apiClient } from '@/lib/api'
import toast from 'react-hot-toast'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Settings, User, Lock } from 'lucide-react'

export default function SettingsPage() {
  const { user, setUser } = useAuthStore()
  const [name, setName] = useState(user?.full_name || '')
  const [pwd, setPwd] = useState({ current: '', new: '', confirm: '' })
  const [savingP, setSavingP] = useState(false)
  const [savingW, setSavingW] = useState(false)

  const saveProfile = async () => {
    setSavingP(true)
    try { const r = await apiClient.patch('/auth/me', { full_name: name }); setUser(r.data); toast.success('Saqlandi') }
    catch { toast.error('Xato') } finally { setSavingP(false) }
  }

  const changePassword = async () => {
    if (pwd.new !== pwd.confirm) { toast.error('Parollar mos kelmaydi'); return }
    if (pwd.new.length < 8) { toast.error('Kamida 8 ta belgi'); return }
    setSavingW(true)
    try { await apiClient.post('/auth/change-password', { current_password: pwd.current, new_password: pwd.new }); setPwd({ current:'',new:'',confirm:'' }); toast.success("Parol o'zgartirildi") }
    catch (e: any) { toast.error(e.response?.data?.detail || 'Xato') } finally { setSavingW(false) }
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <div className="text-xs tracking-[0.3em] text-jeya-cyan mb-1">SOZLAMALAR</div>
        <h1 className="text-2xl font-black flex items-center gap-3">
          <Settings size={22} className="text-jeya-cyan" style={{ filter: 'drop-shadow(0 0 6px #00f5ff)' }} />
          Hisob sozlamalari
        </h1>
      </div>
      <Card className="mb-5">
        <h2 className="font-bold text-jeya-text mb-4 flex items-center gap-2 text-sm">
          <User size={15} className="text-jeya-cyan" /> PROFIL
        </h2>
        <div className="space-y-4">
          <Input label="To'liq ism" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email" value={user?.email || ''} disabled className="opacity-50" />
          <Button variant="cyan" isLoading={savingP} onClick={saveProfile}>Saqlash</Button>
        </div>
      </Card>
      <Card>
        <h2 className="font-bold text-jeya-text mb-4 flex items-center gap-2 text-sm">
          <Lock size={15} className="text-jeya-cyan" /> PAROL
        </h2>
        <div className="space-y-4">
          <Input label="Joriy parol" type="password" value={pwd.current} onChange={(e) => setPwd({ ...pwd, current: e.target.value })} />
          <Input label="Yangi parol" type="password" value={pwd.new} onChange={(e) => setPwd({ ...pwd, new: e.target.value })} />
          <Input label="Tasdiqlash" type="password" value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} />
          <Button variant="cyan" isLoading={savingW} onClick={changePassword}>O'zgartirish</Button>
        </div>
      </Card>
    </div>
  )
}
