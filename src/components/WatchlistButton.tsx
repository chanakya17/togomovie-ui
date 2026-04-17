'use client'

import { useState, useEffect } from 'react'
import { Bookmark } from 'lucide-react'
import { watchlistApi } from '@/lib/api'
import { isAuthenticated } from '@/lib/auth'
import { cn } from '@/lib/utils'

export function WatchlistButton({ movieId }: { movieId: number }) {
  const [inList, setInList]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [authed, setAuthed]   = useState(false)

  useEffect(() => {
    setAuthed(isAuthenticated())
    if (isAuthenticated()) {
      watchlistApi.list()
        .then(list => setInList(list.some(m => m.id === movieId)))
        .catch(() => {})
    }
  }, [movieId])

  if (!authed) return null

  async function toggle() {
    setLoading(true)
    try {
      if (inList) {
        await watchlistApi.remove(movieId)
        setInList(false)
      } else {
        await watchlistApi.add(movieId)
        setInList(true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors border',
        inList
          ? 'bg-brand border-brand text-white'
          : 'border-zinc-700 text-zinc-300 hover:border-brand hover:text-white'
      )}
    >
      <Bookmark size={15} fill={inList ? 'currentColor' : 'none'} />
      {inList ? 'In Watchlist' : 'Add to Watchlist'}
    </button>
  )
}
