import { useState } from 'react'
import styled from 'styled-components'
import { Review } from '../types'
import { createReview, deleteReview } from '../lib/api'
import { useAuth } from '../context/AuthContext'

const Container = styled.div`
  margin-top: 24px;
`

const AverageRating = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`

const Stars = styled.div`
  font-size: 24px;
`

const StarButton = styled.button<{ $filled: boolean }>`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${props => props.$filled ? '#d18b4f' : '#c6b7a8'};

  &:hover {
    color: #d18b4f;
  }
`

const ReviewForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
  padding: 16px;
  background-color: #f4f1e1;
  border-radius: 8px;
`

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #c6b7a8;
  border-radius: 4px;
  min-height: 80px;
  resize: vertical;
`

const Button = styled.button`
  background-color: #6a0d2b;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  align-self: flex-start;

  &:hover {
    background-color: #8a1d3b;
  }
`

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const ReviewCard = styled.div`
  padding: 16px;
  background-color: #f4f1e1;
  border-radius: 8px;
`

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`

const ReviewAuthor = styled.span`
  font-weight: 600;
`

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    text-decoration: underline;
  }
`

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
    <Container>
      <h3>Reviews</h3>

      {averageRating !== undefined && (
        <AverageRating>
          <Stars>{renderStars(averageRating)}</Stars>
          <span>{averageRating.toFixed(1)} ({reviews.length} reviews)</span>
        </AverageRating>
      )}

      {user && !userReview && (
        <ReviewForm onSubmit={handleSubmit}>
          <div>
            <span>Your rating: </span>
            {[1, 2, 3, 4, 5].map(n => (
              <StarButton
                key={n}
                type="button"
                $filled={n <= rating}
                onClick={() => setRating(n)}
              >
                ★
              </StarButton>
            ))}
          </div>
          <TextArea
            placeholder="Leave a comment (optional)"
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </ReviewForm>
      )}

      {!user && (
        <p style={{ fontStyle: 'italic', color: '#666' }}>
          Log in to leave a review
        </p>
      )}

      <ReviewList>
        {reviews.map(review => (
          <ReviewCard key={review.id}>
            <ReviewHeader>
              <div>
                <ReviewAuthor>{review.profile?.display_name || 'Anonymous'}</ReviewAuthor>
                <span style={{ marginLeft: '8px', color: '#d18b4f' }}>
                  {renderStars(review.rating)}
                </span>
              </div>
              {review.user_id === user?.id && (
                <DeleteButton onClick={() => handleDelete(review.id)}>
                  Delete
                </DeleteButton>
              )}
            </ReviewHeader>
            {review.comment && <p>{review.comment}</p>}
          </ReviewCard>
        ))}
      </ReviewList>
    </Container>
  )
}

export default Rating
