'use client'

import { useState, useEffect } from 'react'
import { reviewsApi } from '@/lib/api'
import { isAuthenticated } from '@/lib/auth'
import { formatDate } from '@/lib/utils'
import { Star } from 'lucide-react'
import type { Review } from '@/types'

export function ReviewSection({ movieId }: { movieId: number }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [rating, setRating]   = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [authed, setAuthed]   = useState(false)

  useEffect(() => {
    setAuthed(isAuthenticated())
    reviewsApi.list(movieId).then(page => setReviews(page.content)).catch(() => {})
  }, [movieId])

  async function submitReview(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const review = await reviewsApi.create(movieId, { rating, content: comment || undefined })
      setReviews(prev => [review, ...prev])
      setComment('')
      setRating(5)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold">Reviews</h2>

      {/* Write review */}
      {authed && (
        <form onSubmit={submitReview} className="card p-5 space-y-4">
          <h3 className="font-medium">Write a Review</h3>

          {/* Star rating */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(s => (
              <button key={s} type="button" onClick={() => setRating(s)}>
                <Star
                  size={24}
                  className={s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-600'}
                />
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Share your thoughts (optional)"
            rows={3}
            className="input resize-none"
          />

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Submitting…' : 'Submit Review'}
          </button>
        </form>
      )}

      {/* Review list */}
      {reviews.length === 0 ? (
        <p className="text-zinc-400 text-sm">No reviews yet. Be the first!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map(r => (
            <div key={r.id} className="card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{r.username}</span>
                <div className="flex items-center gap-1 text-yellow-400 text-sm">
                  <Star size={13} fill="currentColor" />
                  {r.rating}/5
                </div>
              </div>
              {r.content && <p className="text-sm text-zinc-300">{r.content}</p>}
              <p className="text-xs text-zinc-500">{formatDate(r.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
