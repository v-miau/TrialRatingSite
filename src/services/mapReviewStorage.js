export function loadMapReview(mapId) { // Loading reviews from localStorage
    try {
        return {
            text: localStorage.getItem(`map-review:${mapId}`) ?? '',
            score: localStorage.getItem(`map-score:${mapId}`) ?? '',
            error: null,
        };
    } catch (error) {
        return { text: '', score: '', error: error.message };
    }
}

export function getMapReviewStatus(mapId) { // Handle errors if review not found
    const review = loadMapReview(mapId);
    if (review.error) {
        return { hasReview: null, score: null, error: `Could not read saved review: ${review.error}` };
    }

    const hasReview = review.text.trim().length > 0 || review.score !== '';
    if (!hasReview) {
        return { hasReview: false, score: null, error: null };
    }

    if (review.score === '') {
        return { hasReview: true, score: null, error: null };
    }

    const score = Number(review.score);
    if (!Number.isInteger(score) || score < 0 || score > 100) {
        return { hasReview: true, score: null, error: 'Saved score is invalid' };
    }

    return { hasReview: true, score, error: null };
}
