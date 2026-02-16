'use client'

import './globals.css'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, usePathname } from 'next/navigation'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const hasSession = !!data.session

      if (hasSession && pathname === '/') {
        router.push('/dashboard')
      }

      if (!hasSession && pathname.startsWith('/dashboard')) {
        router.push('/')
      }
    })
  }, [pathname])

  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
