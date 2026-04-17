'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { favoritesApi } from '@/lib/api'
import { isAuthenticated } from '@/lib/auth'
import { cn } from '@/lib/utils'

export function FavoriteButton({ movieId }: { movieId: number }) {
  const [faved, setFaved]     = useState(false)
  const [loading, setLoading] = useState(false)
  const [authed, setAuthed]   = useState(false)

  useEffect(() => {
    setAuthed(isAuthenticated())
    if (isAuthenticated()) {
      favoritesApi.list()
        .then(list => setFaved(list.some(m => m.id === movieId)))
        .catch(() => {})
    }
  }, [movieId])

  if (!authed) return null

  async function toggle() {
    setLoading(true)
    try {
      if (faved) {
        await favoritesApi.remove(movieId)
        setFaved(false)
      } else {
        await favoritesApi.add(movieId)
        setFaved(true)
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
        faved
          ? 'bg-pink-600 border-pink-600 text-white'
          : 'border-zinc-700 text-zinc-300 hover:border-pink-500 hover:text-white'
      )}
    >
      <Heart size={15} fill={faved ? 'currentColor' : 'none'} />
      {faved ? 'Favorited' : 'Add to Favorites'}
    </button>
  )
}
