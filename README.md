# ✨ SmartBookmark

SmartBookmark is a real-time bookmark manager built with **Next.js (App Router)**, **Supabase**, and **Tailwind CSS**.

It features secure Google login, private user data, and instant UI updates across tabs/devices with a premium glass UI.

---

## 🚀 Features

- 🔐 Google OAuth (Supabase Auth)
- 🔒 Private bookmarks (Row Level Security)
- ➕ Add & ❌ Delete bookmarks
- ⭐ Mark as Important (Pinned to top)
- ⚡ Real-time updates (Supabase Realtime)
- 🎨 Ultra-premium glassmorphism UI
- ☁️ Deployed on Vercel

---

## 🛠 Stack

Next.js • Supabase • Postgres • Realtime • Tailwind • Vercel

---

## ⚔️ Challenges & Solutions

**Problem:** Bookmarks not updating in real time  
**Solution:** Implemented Supabase Realtime subscriptions and direct state updates.

**Problem:** Insert/Delete queries failing  
**Solution:** Fixed Supabase Row Level Security (RLS) policies using `auth.uid()`.

**Problem:** Delete felt slow  
**Solution:** Used optimistic UI updates for instant feedback.

**Problem:** Secrets risk in GitHub  
**Solution:** Added `.env.local` to `.gitignore` and created `.env.example`.

---

## 🔐 Security

Supabase Row Level Security ensures users only access their own bookmarks.

---

## 🌐 Deployment

Hosted on Vercel.

---

