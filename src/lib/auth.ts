import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types'

const TOKEN_KEY = 'togo_token'
const USER_KEY  = 'togo_user'

// ─── Token storage ────────────────────────────────────────────────────────────

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getStoredUser(): { username: string; email: string } | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(USER_KEY)
  return raw ? JSON.parse(raw) : null
}

// ─── Auth API calls ───────────────────────────────────────────────────────────

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const res = await fetch('/api/backend/auth/login', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(data),
  })
  if (!res.ok) throw new Error((await res.json())?.detail ?? 'Login failed')
  const auth: AuthResponse = await res.json()
  setToken(auth.token)
  localStorage.setItem(USER_KEY, JSON.stringify({ username: auth.username, email: auth.email }))
  return auth
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const res = await fetch('/api/backend/auth/register', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(data),
  })
  if (!res.ok) throw new Error((await res.json())?.detail ?? 'Registration failed')
  const auth: AuthResponse = await res.json()
  setToken(auth.token)
  localStorage.setItem(USER_KEY, JSON.stringify({ username: auth.username, email: auth.email }))
  return auth
}

export function logout(): void {
  clearToken()
}

export function isAuthenticated(): boolean {
  return !!getToken()
}
