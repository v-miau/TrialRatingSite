import { useState } from 'react'
import { Link } from 'react-router'
import { loadMapReview } from '../services/mapReviewStorage.js'

function MapReview({ mapId }) { // Display review data
    const [review] = useState(() => loadMapReview(mapId))

    return (
        <section className="h-100 border rounded p-3" aria-label="Map review">
            <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
                <h2 className="h4 mb-0">Your review</h2>
                {review && !review.error && (
                    <p className="mb-0">
                        <strong>Score:</strong>{' '}
                        {review.score === null || review.score === '' ? 'Not rated' : `${review.score} / 100`}
                    </p>
                )}
                <Link className="btn btn-primary ms-auto" to={`/${encodeURIComponent(mapId)}/review`}>
                    Edit review
                </Link>
            </div>
            {review.error && <p role="alert">Could not load your review: {review.error}</p>}
            {review && !review.error && (
                <p className="map-review-text">
                    {review.text || 'No review written yet.'}
                </p>
            )}
        </section>
    )
}

export default MapReview
