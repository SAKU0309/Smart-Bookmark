'use client'

import { supabase } from '@/lib/supabase'

export default function SignInPage() {
  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0f172a] text-white">

      {/* Glow Background (same as dashboard) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl animate-pulse" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl animate-pulse" />
      </div>

      {/* Content (NO BOX) */}
      <div className="relative flex flex-col items-center text-center">
        
        <h1 className="mb-4 bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-300 bg-clip-text text-6xl font-bold tracking-tight text-transparent">
          SmartBookmark
        </h1>

        <p className="mb-10 max-w-md text-lg text-gray-300">
          Save, organize, and access your favorite links  
          with a beautifully minimal experience.
        </p>

        <button
          onClick={signIn}
          className="rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 px-10 py-4 text-lg font-medium text-white shadow-2xl transition duration-300 hover:scale-105 hover:shadow-indigo-500/40 active:scale-95"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-sm text-gray-500">
          Secure login powered by Google & Supabase
        </p>
      </div>
    </main>
  )
}
