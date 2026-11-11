import { Link } from 'react-router'
import { getMapReviewStatus } from '../mapReviewStorage.js'

function MapReviewScore({ mapId }) {
    const reviewStatus = getMapReviewStatus(mapId)

    if (reviewStatus.error) {
        return <span className="badge text-bg-danger" title={reviewStatus.error}>Review unavailable</span>
    }
    if (!reviewStatus.hasReview) {
        return null
    }

    return (
        <span className="badge text-bg-dark text-nowrap">
            {reviewStatus.score === null ? 'No Rating' : `${reviewStatus.score} / 100`}
        </span>
    )
}

function MapList({ maps }) { // Template to build list of maps
    return (
        <div className="map-list-scroll" role="region" aria-label="Maps" tabIndex={0}>
            <ul className="list-group">
                {maps.map((map) => (
                    <li className={`list-group-item ${map.category?.toLowerCase() ?? ''}`} key={map.id}>
                        <Link className="d-flex align-items-center justify-content-between gap-3 text-reset text-decoration-none" to={`/${encodeURIComponent(map.id)}`}>
                            <span>
                                <strong>{map.name}</strong>
                                <span> by {map.author} - {map.points}p </span>
                            </span>
                            <MapReviewScore mapId={map.id} />
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default MapList