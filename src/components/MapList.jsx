function MapList({ maps }) {
    return (
        <ul className="list-group">
            {maps.map((map) => (
                <li className="list-group-item" key={map.id}>
                    <strong>{map.name}</strong>
                    <span> - {map.points} points by {map.author}</span>
                </li>
            ))}
        </ul>
    )
}

export default MapList