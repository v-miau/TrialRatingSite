import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import BackButton from "../components/BackButton.jsx"
import MapImage from "../components/MapImage.jsx"
import { fetchMaps } from '../maps.js';

function MapInfoPage() {
    const { mapId } = useParams();
    const { data: maps = [], isPending, error } = useQuery({
        queryKey: ['maps'],
        queryFn: fetchMaps,
        staleTime: 5 * 60 * 1000,
    });
    const map = maps.find(({ id }) => id === mapId);

    return (
        <>
            <main>
                {isPending && <p role="status">Loading map...</p>}
                {error && <p role="alert">{error.message}</p>}
                {!isPending && !error && !map && <p role="alert">Map not found.</p>}
                {map && (
                    <>
                        <h1>{map.name}</h1>
                        <MapImage mapName={map.name} category={map.category} />
                    </>
                )}
            </main>
            <BackButton />
        </>
    )
}   

export default MapInfoPage