'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Film, Bot, Bookmark, Heart, LogOut, LogIn } from 'lucide-react'
import { cn } from '@/lib/utils'
import { isAuthenticated, logout } from '@/lib/auth'
import { useEffect, useState } from 'react'

const navLinks = [
  { href: '/',          label: 'Movies',    icon: Film     },
  { href: '/chat',      label: 'AI Chat',   icon: Bot      },
  { href: '/watchlist', label: 'Watchlist', icon: Bookmark },
  { href: '/favorites', label: 'Favorites', icon: Heart    },
]

export function Navbar() {
  const pathname      = usePathname()
  const router        = useRouter()
  const [authed, setAuthed] = useState(false)

  useEffect(() => { setAuthed(isAuthenticated()) }, [pathname])

  function handleLogout() {
    logout()
    router.push('/login')
  }

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-brand tracking-tight">
          TOGO<span className="text-white">MOVIE</span>
        </Link>

        {/* Links */}
        <div className="hidden sm:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors',
                pathname === href
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              )}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div>
          {authed ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white px-3 py-1.5 rounded-md hover:bg-zinc-800/50 transition-colors"
            >
              <LogOut size={15} /> Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white px-3 py-1.5 rounded-md hover:bg-zinc-800/50 transition-colors"
            >
              <LogIn size={15} /> Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
