'use client'

import { Toaster } from 'react-hot-toast'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#080f18',
            color: '#e2f4ff',
            border: '1px solid #0d2035',
          },
        }}
      />
    </>
  )
}
