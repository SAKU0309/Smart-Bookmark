'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function UserProfile() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (!user) return null

  return (
    <div className="flex items-center gap-3">
      <img
        src={user.user_metadata.avatar_url}
        alt="avatar"
        className="h-9 w-9 rounded-full"
      />

      <div className="text-sm">
        <div className="font-medium">{user.user_metadata.full_name}</div>
        <button
          onClick={signOut}
          className="text-xs text-gray-500 hover:text-black"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
