import MapList from '../components/MapList.jsx';
import Header from '../components/Header.jsx';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchMaps, mapCategories } from '../fetchmaps.js';

function fixSearchText(value) { // Fix searches
    return value.toLocaleLowerCase().replace(/[\s\p{P}\p{S}]/gu, '');
}




export default function MapsPage() {
    const [search, setSearch] = useState(''); // Create Search useState
    const { data: maps = [], isPending, error } = useQuery({ // Async map data fetch with React-Query
        queryKey: ['maps'],
        queryFn: fetchMaps,
        staleTime: 5 * 60 * 1000,
    });
    const searchTerm = fixSearchText(search);
    const filteredMaps = maps.filter((map) =>
        [map.name, map.author]
            .some((value) => value != null && fixSearchText(value).includes(searchTerm))
    );

    return (
        <>
            <Header />
            <main className="container py-3 maps-page">
                <aside className="maps-controls">
                    <div>
                        <label className="form-label" htmlFor="map-search">Search maps</label>
                        <input
                            className="form-control"
                            id="map-search"
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Name or Author"
                        />
                    </div>
                </aside>
                <section className="maps-results" aria-label="Map results">
                    {isPending && <p role="status">Loading maps...</p>} {/* Loading maps */}
                    {error && <p role="alert">{error.message}</p>} {/* Failed to load maps */}
                    {!isPending && !error && maps.length === 0 && <p>No maps found.</p>} {/* Empty searchbar and no results */}
                    {!isPending && !error && maps.length > 0 && filteredMaps.length === 0 && <p>No maps match your search.</p>} {/* Too much searching */}
                    {!isPending && !error && filteredMaps.length > 0 && <MapList maps={filteredMaps} />} {/* Maps shown if everything ready */}
                </section>
            </main>
        </>
    );
}
