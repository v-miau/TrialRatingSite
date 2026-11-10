import MapList from '../components/MapList.jsx';
import Header from '../components/Header.jsx';

const maps = [
    { id: 1, name: "Abe's Oddyssee", points: '5', author: 'Adi' },
    { id: 2, name: 'Astral', points: '5', author: 'thom.' },
];

function MapsPage() {
    return(
        <>
            <Header />
            <MapList maps={maps} />
        </>
    )
}

export default MapsPage
