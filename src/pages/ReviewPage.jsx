import { useState } from 'react'
import { Link, useParams } from 'react-router'
import Header from "../components/Header.jsx"
import { loadMapReview } from '../services/mapReviewStorage.js'

function getScoreColor(score) { // Score color
    if (score === '' || !Number.isFinite(Number(score)) || Number(score) < 0 || Number(score) > 100) {
        return '#6c757d'
    }

    return `hsl(${Number(score) * 1.2} 70% 42%)`
}

function ReviewEditor({ mapId }) { // Handle updating, saving reviews in localStorage
    const [review, setReview] = useState(() => loadMapReview(mapId))
    const loadError = review.error ? `Could not load saved review: ${review.error}` : null

    function updateReview(field, value) {
        setReview((current) => ({ ...current, [field]: value, error: null, status: '' }))
    }

    function adjustScoreWithWheel(event) {
        event.preventDefault()
        const direction = event.deltaY < 0 ? 1 : -1
        const currentScore = Number(review.score || 0)
        const nextScore = Math.max(0, Math.min(100, Math.round(currentScore) + direction))
        if (nextScore !== currentScore || review.score === '') {
            updateReview('score', String(nextScore))
        }
    }

    function saveReview() { 
        if (review.score !== '') {
            const score = Number(review.score)
            if (!Number.isInteger(score) || score < 0 || score > 100) {
                setReview((current) => ({ ...current, error: 'Score must be a whole number between 0 and 100.', status: '' }))
                return
            }
        }
        try {
            localStorage.setItem(`map-review:${mapId}`, review.text)
            if (review.score === '') {
                localStorage.removeItem(`map-score:${mapId}`)
            } else {
                localStorage.setItem(`map-score:${mapId}`, review.score)
            }
            setReview((current) => ({ ...current, error: null, status: 'Review saved.' }))
        } catch (error) {
            setReview((current) => ({ ...current, error: `Could not save review: ${error.message}`, status: '' }))
        }
    }

    return (
        <>
        <Header/>
        <main className="container py-3">
            <h1>Review for {mapId}</h1>
            {loadError && <p role="alert">{loadError}</p>}
            <div className="row g-3 align-items-start mb-3">
                <div className="col-12 col-md-9">
                    <label className="form-label" htmlFor="map-review"></label>
                    <textarea
                        className="form-control review-editor-textarea"
                        id="map-review"
                        rows="10"
                        value={review.text}
                        onChange={(event) => updateReview('text', event.target.value)}
                    />
                </div>
                <div className="col-12 col-md-3 review-score-control">
                    <label className="form-label" htmlFor="map-score">Score (0–100)</label>
                    <div className="review-score-square rounded" style={{ backgroundColor: getScoreColor(review.score) }}>
                        <input
                            className="review-score-input"
                            id="map-score"
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={review.score}
                            onChange={(event) => updateReview('score', event.target.value)}
                            onWheel={adjustScoreWithWheel}
                            aria-label="Score from 0 to 100"
                        />
                    </div>
                </div>
            </div>
            {review.error && !loadError && <p role="alert">{review.error}</p>}
            {review.status && <p role="status">{review.status}</p>}
            <div className="d-flex gap-2">
                <button className="btn btn-primary" type="button" onClick={saveReview}>Save</button>
                <Link className="btn btn-outline-secondary" to={`/${encodeURIComponent(mapId)}`}>Exit</Link>
            </div>
        </main>
        </>
    )
}

function ReviewPage() { // Load ReviewEditor with current map's ID
    const { mapId } = useParams()
    return <ReviewEditor key={mapId} mapId={mapId} />
}

export default ReviewPage