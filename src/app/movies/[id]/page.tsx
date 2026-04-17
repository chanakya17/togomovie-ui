import { notFound } from 'next/navigation'
import Image from 'next/image'
import { formatDate, formatRating } from '@/lib/utils'
import { ReviewSection } from '@/components/ReviewSection'
import { WatchlistButton } from '@/components/WatchlistButton'
import { FavoriteButton } from '@/components/FavoriteButton'
import type { Movie } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

async function fetchMovie(id: string): Promise<Movie | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8080'}/movies/${id}`,
      { next: { revalidate: 300 } }
    )
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function MovieDetailPage({ params }: Props) {
  const { id } = await params
  const movie = await fetchMovie(id)

  if (!movie) notFound()

  return (
    <div className="space-y-8">
      {/* Backdrop */}
      {movie.backdropUrl && (
        <div className="relative h-64 sm:h-96 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden">
          <Image src={movie.backdropUrl} alt={movie.title} fill className="object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950" />
        </div>
      )}

      {/* Details */}
      <div className="flex flex-col sm:flex-row gap-8">
        {/* Poster */}
        {movie.posterUrl && (
          <div className="flex-shrink-0">
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              width={200}
              height={300}
              className="rounded-xl object-cover"
            />
          </div>
        )}

        {/* Info */}
        <div className="space-y-4 flex-1">
          <h1 className="text-3xl font-bold">{movie.title}</h1>

          <div className="flex flex-wrap gap-3 text-sm text-zinc-400">
            <span>{formatDate(movie.releaseDate)}</span>
            {movie.duration && <span>{movie.duration} min</span>}
            {movie.language && <span>{movie.language.toUpperCase()}</span>}
            <span className="text-yellow-400 font-semibold">★ {formatRating(movie.averageRating)}</span>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {movie.genres.map(g => (
              <span key={g.id} className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs">
                {g.name}
              </span>
            ))}
          </div>

          {/* Description */}
          {movie.description && (
            <p className="text-zinc-300 leading-relaxed">{movie.description}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <WatchlistButton movieId={movie.id} />
            <FavoriteButton movieId={movie.id} />
          </div>

          {/* Watch links */}
          {movie.watchLinks.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-zinc-200">Where to Watch</h3>
              <div className="flex flex-wrap gap-2">
                {movie.watchLinks.map(link => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-sm"
                  >
                    {link.platform} {link.quality && `(${link.quality})`}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <ReviewSection movieId={movie.id} />
    </div>
  )
}
