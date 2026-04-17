import { MovieGrid } from '@/components/MovieGrid'
import { SearchBar } from '@/components/SearchBar'
import { Suspense } from 'react'

interface HomeProps {
  searchParams: Promise<{
    title?: string
    genre?: string
    year?: string
    page?: string
  }>
}

export default async function HomePage({ searchParams }: HomeProps) {
  const params = await searchParams

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="text-center py-12 space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Discover <span className="text-brand">Movies</span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-xl mx-auto">
          Browse, rate, and get AI-powered recommendations for your next watch.
        </p>
      </section>

      {/* Search & Filters */}
      <Suspense>
        <SearchBar initialParams={params} />
      </Suspense>

      {/* Movie grid */}
      <Suspense fallback={<MovieGridSkeleton />}>
        <MovieGrid
          title={params.title}
          genre={params.genre}
          year={params.year ? Number(params.year) : undefined}
          page={params.page ? Number(params.page) : 0}
        />
      </Suspense>
    </div>
  )
}

function MovieGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="card aspect-[2/3] animate-pulse bg-zinc-800" />
      ))}
    </div>
  )
}
