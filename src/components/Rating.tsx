import { useState } from 'react'
import { Review } from '../types'
import { createReview, deleteReview } from '../lib/api'
import { useAuth } from '../context/AuthContext'

interface RatingProps {
  recipeId: string
  reviews: Review[]
  averageRating?: number
  onReviewChange: () => void
}

const Rating = ({ recipeId, reviews, averageRating, onReviewChange }: RatingProps) => {
  const { user } = useAuth()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const userReview = reviews.find(r => r.user_id === user?.id)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSubmitting(true)
    try {
      await createReview(recipeId, rating, comment || null)
      setComment('')
      onReviewChange()
    } catch (error) {
      console.error('Failed to submit review:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Delete your review?')) return

    try {
      await deleteReview(reviewId)
      onReviewChange()
    } catch (error) {
      console.error('Failed to delete review:', error)
    }
  }

  const renderStars = (rating: number) => {
    return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating))
  }

  return (
    <div className="mt-6">
      <h3>Reviews</h3>

      {averageRating !== undefined && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">{renderStars(averageRating)}</span>
          <span>{averageRating.toFixed(1)} ({reviews.length} reviews)</span>
        </div>
      )}

      {user && !userReview && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6 p-4 bg-cream rounded-lg">
          <div>
            <span>Your rating: </span>
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className={`bg-transparent border-none text-2xl cursor-pointer hover:text-copper ${
                  n <= rating ? 'text-copper' : 'text-tan'
                }`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            placeholder="Leave a comment (optional)"
            value={comment}
            onChange={e => setComment(e.target.value)}
            className="p-3 border border-tan rounded min-h-20 resize-y"
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-burgundy text-white border-none rounded px-4 py-2 cursor-pointer self-start hover:bg-burgundy-hover"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {!user && (
        <p className="italic text-gray-500">
          Log in to leave a review
        </p>
      )}

      <div className="flex flex-col gap-4">
        {reviews.map(review => (
          <div key={review.id} className="p-4 bg-cream rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="font-semibold">{review.profile?.display_name || 'Anonymous'}</span>
                <span className="ml-2 text-copper">
                  {renderStars(review.rating)}
                </span>
              </div>
              {review.user_id === user?.id && (
                <button
                  onClick={() => handleDelete(review.id)}
                  className="bg-transparent border-none text-red-600 cursor-pointer text-xs hover:underline"
                >
                  Delete
                </button>
              )}
            </div>
            {review.comment && <p className="text-gray-700">{review.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Rating
