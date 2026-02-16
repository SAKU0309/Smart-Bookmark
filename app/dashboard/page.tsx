'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import UserProfile from '@/components/UserProfile'

type Bookmark = {
  id: string
  url: string
  title: string
}

export default function Dashboard() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')

  useEffect(() => {
  let channel: any

  const initRealtime = async () => {
    const { data } = await supabase.auth.getUser()
    const user = data.user
    if (!user) return

    fetchBookmarks()

    channel = supabase
      .channel('bookmarks-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Realtime:', payload)

          if (payload.eventType === 'DELETE') {
            setBookmarks((prev) =>
              prev.filter((b) => b.id !== payload.old.id)
            )
            return
          }

          // For inserts & updates → safe refetch
          fetchBookmarks()
        }
      )
      .subscribe()
  }

  initRealtime()

  return () => {
    if (channel) supabase.removeChannel(channel)
  }
}, [])



 const fetchBookmarks = async () => {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .order('important', { ascending: false })  
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return
  }

  setBookmarks(data || [])
}
  const toggleImportant = async (id: string, current: boolean) => {
  setBookmarks(prev =>
    prev.map(b =>
      b.id === id ? { ...b, important: !current } : b
    )
  )

  const { error } = await supabase
    .from('bookmarks')
    .update({ important: !current })
    .eq('id', id)

  if (error) {
    console.error(error)
    fetchBookmarks() 
  }
}


  const addBookmark = async () => {
    const { data, error: userError } = await supabase.auth.getUser()
    const user = data.user

    if (!user) {
      alert('Not logged in')
      return
    }

    if (!url) {
      alert('URL required')
      return
    }

    const { error } = await supabase.from('bookmarks').insert({
      user_id: user.id,
      url,
      title,
    })

    if (error) {
      console.error(error)
      alert(error.message)
      return
    }

    setUrl('')
    setTitle('')
  }

  const deleteBookmark = async (id: string) => {
  setBookmarks((prev) => prev.filter((b) => b.id !== id))
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(error)
    alert(error.message)
    fetchBookmarks()
  }
}


 return (
  <main className="relative min-h-screen overflow-hidden bg-[#0f172a] p-10 text-white">
    
    {/* Glow Background */}
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
      <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
    </div>

    <div className="relative mx-auto max-w-2xl">
      
      {/* Header */}
      <header className="mb-10 flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
        <h1 className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-300 bg-clip-text text-3xl font-bold text-transparent">
          SmartBookmark
        </h1>
        <UserProfile />
      </header>

      {/* Add Bookmark */}
      <div className="mb-8 rounded-2xl border border-white/10 bg-white/10 p-4 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            placeholder="Paste URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-white outline-none placeholder:text-gray-400 focus:border-indigo-400"
          />
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-white outline-none placeholder:text-gray-400 focus:border-indigo-400"
          />
          <button
            onClick={addBookmark}
            className="rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 px-6 py-2 text-sm font-medium text-white shadow-lg transition duration-300 hover:scale-105 hover:shadow-indigo-500/40 active:scale-95"
          >
            Add
          </button>
        </div>
      </div>

      {/* Bookmark List */}
      <div className="space-y-4">
        {bookmarks.map((b) => (
          <div
            key={b.id}
            className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 p-4 shadow-lg backdrop-blur-xl transition duration-300 hover:scale-[1.02] hover:bg-white/20"
          >
            <div className="min-w-0">
              <div className="truncate font-medium text-white">
                {b.title || 'Untitled Bookmark'}
              </div>

              <a
                href={b.url}
                target="_blank"
                className="block truncate text-sm text-indigo-300 hover:text-indigo-200"
              >
                {b.url}
              </a>
            </div>

            <div className="flex items-center gap-3">
  
  {/* ⭐ Star Button */}
  <button
    onClick={() => toggleImportant(b.id, (b as any).important)}
    className="text-lg transition hover:scale-110"
  >
    {(b as any).important ? '⭐' : '☆'}
  </button>

  {/* Delete Button */}
  <button
    onClick={() => deleteBookmark(b.id)}
    className="rounded-lg px-3 py-1 text-sm text-red-400 opacity-70 transition hover:bg-red-500/10 hover:opacity-100"
  >
    Delete
  </button>
</div>

          </div>
        ))}
      </div>
    </div>
  </main>
)

}
