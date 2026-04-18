// ─── Movie ────────────────────────────────────────────────────────────────────

export interface Movie {
  id: number
  title: string
  description: string | null
  releaseDate: string
  status: string
  averageRating: number
  language: string | null
  country: string | null
  posterUrl: string | null
  backdropUrl: string | null
  duration: number | null
  genres: Genre[]
  watchLinks: WatchLink[]
}

export interface MovieSummary {
  id: number
  title: string
  releaseDate: string
  averageRating: number
  posterUrl: string | null
  genres: string[]
}

export interface Genre {
  id: number
  name: string
}

export interface WatchLink {
  id: number
  providerName: string
  watchUrl: string
  regionCode: string | null
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface Page<T> {
  content: T[]
  totalPages: number
  totalElements: number
  number: number
  size: number
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  username: string
  email: string
  role: string
}

// ─── Review ───────────────────────────────────────────────────────────────────

export interface Review {
  id: number
  userId: number
  username: string
  rating: number
  content: string | null
  createdAt: string
}

export interface ReviewRequest {
  rating: number
  content?: string
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}
