import { Link } from 'react-router'

function MapList({ maps }) { // Template to build list of maps
    return (
        <div className="map-list-scroll" role="region" aria-label="Maps" tabIndex={0}>
            <ul className="list-group">
                {maps.map((map) => (
                    <li className={`list-group-item ${map.category?.toLowerCase() ?? ''}`} key={map.id}>
                        <Link className="d-block text-reset text-decoration-none" to={`/${encodeURIComponent(map.id)}`}>
                            <strong>{map.name}</strong>
                            <span> by {map.author} - {map.points}p </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default MapList