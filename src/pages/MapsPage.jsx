import MapList from '../components/MapList.jsx';
import Header from '../components/Header.jsx';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchMaps, mapCategories } from '../maps.js';
// For fetch

function normalizeSearchText(value) { // Fix searches
    return value.toLocaleLowerCase().replace(/[\s\p{P}\p{S}]/gu, '');
}

function CategoriesList() { // Build difficulty list for page
    return (
        <section aria-label="Map categories" className="mb-3">
            <h2 className="h5">Categories</h2>
            <ul className="list-inline mb-0">
                {mapCategories.map(({ name, range }) => (
                    <li className="list-inline-item" key={name}>
                        <strong>{name}:</strong> {range}
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default function MapsPage() { // Page
    const [search, setSearch] = useState('');  // Search
    const { data: maps = [], isPending, error } = useQuery({
        queryKey: ['maps'],
        queryFn: fetchMaps,
        staleTime: 5 * 60 * 1000,
    });
    const searchTerm = normalizeSearchText(search);
    const filteredMaps = maps.filter((map) =>
        [map.name, map.author]
            .some((value) => value != null && normalizeSearchText(value).includes(searchTerm))
    );

    return (
        <>
            <Header />
            <main className="container py-3 maps-page">
                <aside className="maps-controls">
                    <CategoriesList />
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
                    {isPending && <p role="status">Loading maps...</p>}
                    {error && <p role="alert">{error.message}</p>}
                    {!isPending && !error && maps.length === 0 && <p>No maps found.</p>}
                    {!isPending && !error && maps.length > 0 && filteredMaps.length === 0 && <p>No maps match your search.</p>}
                    {!isPending && !error && filteredMaps.length > 0 && <MapList maps={filteredMaps} />}
                </section>
            </main>
        </>
    );
}
