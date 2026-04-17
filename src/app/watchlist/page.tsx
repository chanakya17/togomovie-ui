'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { watchlistApi } from '@/lib/api'
import { MovieCard } from '@/components/MovieCard'
import type { MovieSummary } from '@/types'

export default function WatchlistPage() {
  const [movies, setMovies]   = useState<MovieSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    watchlistApi.list()
      .then(setMovies)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-zinc-400">Loading…</p>
  if (error)   return <p className="text-red-400">{error}</p>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Watchlist</h1>

      {movies.length === 0 ? (
        <div className="text-center py-16 text-zinc-400">
          <p>Your watchlist is empty.</p>
          <Link href="/" className="text-brand hover:underline mt-2 inline-block">
            Browse movies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map(m => <MovieCard key={m.id} movie={m} />)}
        </div>
      )}
    </div>
  )
}
