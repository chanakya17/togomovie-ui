'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { useState, useTransition } from 'react'

interface Props {
  initialParams: { title?: string; genre?: string; year?: string }
}

export function SearchBar({ initialParams }: Props) {
  const router                  = useRouter()
  const searchParams            = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [title, setTitle] = useState(initialParams.title ?? '')
  const [genre, setGenre] = useState(initialParams.genre ?? '')
  const [year,  setYear]  = useState(initialParams.year  ?? '')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (title) params.set('title', title)
    if (genre) params.set('genre', genre)
    if (year)  params.set('year',  year)
    startTransition(() => router.push(`/?${params}`))
  }

  function handleClear() {
    setTitle('')
    setGenre('')
    setYear('')
    startTransition(() => router.push('/'))
  }

  const hasFilters = title || genre || year

  return (
    <form onSubmit={handleSearch} className="flex flex-wrap gap-3 items-end">
      {/* Title */}
      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs text-zinc-400 mb-1">Search</label>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Movie title…"
            className="input pl-8"
          />
        </div>
      </div>

      {/* Genre */}
      <div className="w-36">
        <label className="block text-xs text-zinc-400 mb-1">Genre</label>
        <input
          type="text"
          value={genre}
          onChange={e => setGenre(e.target.value)}
          placeholder="e.g. Action"
          className="input"
        />
      </div>

      {/* Year */}
      <div className="w-28">
        <label className="block text-xs text-zinc-400 mb-1">Year</label>
        <input
          type="number"
          value={year}
          onChange={e => setYear(e.target.value)}
          placeholder="e.g. 2024"
          min={1900}
          max={new Date().getFullYear() + 1}
          className="input"
        />
      </div>

      <button type="submit" className="btn-primary" disabled={isPending}>
        {isPending ? 'Searching…' : 'Search'}
      </button>

      {hasFilters && (
        <button type="button" onClick={handleClear} className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white px-3 py-2">
          <X size={14} /> Clear
        </button>
      )}
    </form>
  )
}
