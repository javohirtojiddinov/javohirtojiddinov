import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  full_name: string
  email: string
  language: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  logout: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (token, user) => {
        set({ token, user, isAuthenticated: true })
        if (typeof window !== 'undefined') {
          localStorage.setItem('jeya_token', token)
        }
      },
      logout: () => {
        set({ token: null, user: null, isAuthenticated: false })
        if (typeof window !== 'undefined') {
          localStorage.removeItem('jeya_token')
        }
      },
      setUser: (user) => set({ user }),
    }),
    {
      name: 'jeya-auth',
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)
