function MapList({ maps }) {
    return (
        <ul className="map-list">
            {maps.map((map) => (
                <li className="map-list-item" key={map.id}>
                    <strong>{map.name}</strong>
                    <span> - {map.points} points by {map.author}</span>
                </li>
            ))}
        </ul>
    )
}

export default MapList