import { MovieCard } from './MovieCard'
import type { MovieSummary, Page } from '@/types'
import Link from 'next/link'

interface Props {
  title?:  string
  genre?:  string
  year?:   number
  page?:   number
}

async function fetchMovies(props: Props): Promise<Page<MovieSummary>> {
  const params = new URLSearchParams()
  params.set('page', String(props.page ?? 0))
  params.set('size', '20')
  if (props.title) params.set('title', props.title)
  if (props.genre) params.set('genre', props.genre)
  if (props.year)  params.set('year',  String(props.year))

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8080'}/movies?${params}`,
    { next: { revalidate: 60 } }
  )
  if (!res.ok) throw new Error('Failed to fetch movies')
  return res.json()
}

export async function MovieGrid(props: Props) {
  let data: Page<MovieSummary>

  try {
    data = await fetchMovies(props)
  } catch {
    return <p className="text-red-400 text-center py-8">Failed to load movies. Is the backend running?</p>
  }

  if (data.content.length === 0) {
    return <p className="text-zinc-400 text-center py-8">No movies found.</p>
  }

  const currentPage = data.number
  const totalPages  = data.totalPages

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-400">{data.totalElements} movies</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {data.content.map(m => <MovieCard key={m.id} movie={m} />)}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          {currentPage > 0 && (
            <PaginationLink page={currentPage - 1} props={props}>← Prev</PaginationLink>
          )}
          <span className="px-4 py-2 text-sm text-zinc-400">
            {currentPage + 1} / {totalPages}
          </span>
          {currentPage < totalPages - 1 && (
            <PaginationLink page={currentPage + 1} props={props}>Next →</PaginationLink>
          )}
        </div>
      )}
    </div>
  )
}

function PaginationLink({ page, props, children }: { page: number; props: Props; children: React.ReactNode }) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  if (props.title) params.set('title', props.title)
  if (props.genre) params.set('genre', props.genre)
  if (props.year)  params.set('year',  String(props.year))

  return (
    <Link href={`/?${params}`} className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors">
      {children}
    </Link>
  )
}
