import { getToken } from './auth'
import type { Movie, MovieSummary, Page, Review, ReviewRequest } from '@/types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function authHeaders(): HeadersInit {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function get<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const url = new URL(`/api/backend${path}`, window.location.origin)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v))
    })
  }
  const res = await fetch(url.toString(), { headers: authHeaders() })
  if (!res.ok) throw new Error((await res.json())?.detail ?? `GET ${path} failed`)
  return res.json()
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`/api/backend${path}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body:    JSON.stringify(body),
  })
  if (!res.ok) throw new Error((await res.json())?.detail ?? `POST ${path} failed`)
  return res.json()
}

async function del(path: string): Promise<void> {
  const res = await fetch(`/api/backend${path}`, {
    method:  'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error(`DELETE ${path} failed`)
}

// ─── Movies ───────────────────────────────────────────────────────────────────

export const moviesApi = {
  list: (params?: {
    page?: number
    size?: number
    title?: string
    genre?: string
    year?: number
    status?: string
  }): Promise<Page<MovieSummary>> =>
    get('/movies', params as Record<string, string | number | undefined>),

  getById: (id: number): Promise<Movie> => get(`/movies/${id}`),
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export const reviewsApi = {
  list:   (movieId: number, page = 0, size = 20): Promise<Page<Review>> =>
    get(`/movies/${movieId}/reviews`, { page, size }),
  create: (movieId: number, data: ReviewRequest): Promise<Review> =>
    post(`/movies/${movieId}/reviews`, data),
  delete: (movieId: number, reviewId: number): Promise<void> =>
    del(`/movies/${movieId}/reviews/${reviewId}`),
}

// ─── Watchlist ────────────────────────────────────────────────────────────────

export const watchlistApi = {
  list:   (): Promise<MovieSummary[]> => get('/users/me/watchlist'),
  add:    (movieId: number): Promise<void> => post(`/users/me/watchlist/${movieId}`, {}),
  remove: (movieId: number): Promise<void> => del(`/users/me/watchlist/${movieId}`),
}

// ─── Favorites ────────────────────────────────────────────────────────────────

export const favoritesApi = {
  list:   (): Promise<MovieSummary[]> => get('/users/me/favorites'),
  add:    (movieId: number): Promise<void> => post(`/users/me/favorites/${movieId}`, {}),
  remove: (movieId: number): Promise<void> => del(`/users/me/favorites/${movieId}`),
}

// ─── Genres ───────────────────────────────────────────────────────────────────

export const genresApi = {
  list: (): Promise<{ id: number; name: string }[]> => get('/genres'),
}
