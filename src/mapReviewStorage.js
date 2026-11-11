export function getMapReviewStatus(mapId) {
    try {
        const text = localStorage.getItem(`map-review:${mapId}`) ?? '';
        const storedScore = localStorage.getItem(`map-score:${mapId}`);
        const hasReview = text.trim().length > 0 || (storedScore !== null && storedScore !== '');

        if (!hasReview) {
            return { hasReview: false, score: null, error: null };
        }

        if (storedScore === null || storedScore === '') {
            return { hasReview: true, score: null, error: null };
        }

        const score = Number(storedScore);
        if (!Number.isInteger(score) || score < 0 || score > 100) {
            return { hasReview: true, score: null, error: 'Saved score is invalid' };
        }

        return { hasReview: true, score, error: null };
    } catch (error) {
        return { hasReview: null, score: null, error: `Could not read saved review: ${error.message}` };
    }
}
