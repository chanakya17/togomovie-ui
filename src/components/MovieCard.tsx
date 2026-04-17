import Link from 'next/link'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { formatRating } from '@/lib/utils'
import type { MovieSummary } from '@/types'

interface Props {
  movie: MovieSummary
}

export function MovieCard({ movie }: Props) {
  return (
    <Link href={`/movies/${movie.id}`} className="card group block hover:ring-2 hover:ring-brand transition">
      {/* Poster */}
      <div className="relative aspect-[2/3] bg-zinc-800">
        {movie.posterUrl ? (
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            fill
            className="object-cover group-hover:opacity-80 transition"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-600 text-4xl">🎬</div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 space-y-1">
        <p className="font-medium text-sm line-clamp-2 leading-snug">{movie.title}</p>
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>{new Date(movie.releaseDate).getFullYear()}</span>
          <span className="flex items-center gap-0.5 text-yellow-400">
            <Star size={11} fill="currentColor" />
            {formatRating(movie.averageRating)}
          </span>
        </div>
        {movie.genres.length > 0 && (
          <p className="text-xs text-zinc-500 truncate">{movie.genres.join(', ')}</p>
        )}
      </div>
    </Link>
  )
}
