import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import BackButton from "../components/BackButton.jsx";
import MapImage from "../components/MapImage.jsx";
import MapReview from "../components/MapReview.jsx";
import { fetchMaps } from '../services/maps.js';
import Header from "../components/Header.jsx"

function MapInfoPage() {
    const { mapId } = useParams();
    const { data: maps = [], isPending, error } = useQuery({
        queryKey: ['maps'],
        queryFn: fetchMaps,
        staleTime: 60 * 60 * 1000,
    });
    const map = maps.find(({ id }) => id === mapId);

    return (
        <>
            <Header />
            <main className="container py-3">
                {isPending && <p role="status">Loading map...</p>}
                {error && <p role="alert">{error.message}</p>}
                {!isPending && !error && !map && <p role="alert">Map not found.</p>}
                {map && (
                    <>
                        <h1>{map.name}</h1>
                        <div className="row g-3 align-items-stretch">
                            <aside className="col-12 col-md-6" aria-label="Map thumbnail">
                                <MapImage mapName={map.name} category={map.category} />
                            </aside>
                            <div className="col-12 col-md-6">
                                <MapReview key={map.id} mapId={map.id} />
                            </div>
                        </div>
                    </>
                )}
                <div className="mt-3">
                    <BackButton />
                </div>
            </main>
        </>
    )
}   

export default MapInfoPage