import { Link } from 'react-router'

function MapList({ maps }) {
    return (
        <ul className="list-group">
            {maps.map((map) => (
                <li className="list-group-item" key={map.id}>
                    <Link className="d-block text-reset text-decoration-none" to={`/${encodeURIComponent(map.id)}`}>
                        <strong>{map.name}</strong>
                        <span> - {map.points} points by {map.author}</span>
                    </Link>
                </li>
            ))}
        </ul>
    )
}

export default MapList