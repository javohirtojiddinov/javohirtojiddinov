'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import Sidebar from '@/components/layout/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  useEffect(() => { if (!isAuthenticated) router.push('/auth/login') }, [isAuthenticated, router])
  if (!isAuthenticated) return (
    <div className="min-h-screen bg-jeya-dark flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-jeya-cyan/40 border-t-jeya-cyan animate-spin" />
    </div>
  )
  return (
    <div className="flex h-screen bg-jeya-dark overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
