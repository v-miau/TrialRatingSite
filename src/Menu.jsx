const maps = [
  { id: 1, name: 'Abe\'s Oddyssee', points: '5', author: "Adi" },
  { id: 2, name: 'Astral', points: '5', author: "thom." },
]

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

export default function Menu() {
    return <MapList maps={maps} />
}