import MapList from '../components/MapList.jsx';
import Header from '../components/Header.jsx';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchMaps, /*mapCategories*/ } from '../services/maps.js';
import { getMapReviewStatus } from '../services/mapReviewStorage.js';
// For fetch

function normalizeSearchText(value) { // Fix searches
    return value.toLocaleLowerCase().replace(/[\s\p{P}\p{S}]/gu, '');
}

/* function CategoriesList() { // Build difficulty list for page, unused but keeping it here for now
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
} */

export default function MapsPage() { // Page
    const [search, setSearch] = useState('');  // Search
    const [sortBy, setSortBy] = useState('points');
    const [reverseOrder, setReverseOrder] = useState(false);
    const [showReviewed, setShowReviewed] = useState(true);
    const [showUnreviewed, setShowUnreviewed] = useState(true);
    const { data: maps = [], isPending, error } = useQuery({
        queryKey: ['maps'],
        queryFn: fetchMaps,
        staleTime: 60 * 60 * 1000,
    });
    const searchTerm = normalizeSearchText(search);
    const mapsWithReviewStatus = maps.map((map) => ({
        ...map,
        reviewStatus: getMapReviewStatus(map.id),
    }));
    const reviewStatusErrors = mapsWithReviewStatus.filter(({ reviewStatus }) => reviewStatus.error);
    const sortedMaps = mapsWithReviewStatus
        .filter((map) =>
            [map.name, map.author]
                .some((value) => value != null && normalizeSearchText(value).includes(searchTerm))
        )
        .filter(({ reviewStatus }) =>
            reviewStatus.hasReview === null
            || (reviewStatus.hasReview ? showReviewed : showUnreviewed)
        )
        .sort((a, b) => {
            if (sortBy === 'rating') {
                if (a.reviewStatus.score === null) return b.reviewStatus.score === null ? 0 : 1;
                if (b.reviewStatus.score === null) return -1;
                return reverseOrder
                    ? a.reviewStatus.score - b.reviewStatus.score
                    : b.reviewStatus.score - a.reviewStatus.score;
            }
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'author') return a.author.localeCompare(b.author);
            return 0;
        });
    const filteredMaps = reverseOrder && sortBy !== 'rating' ? sortedMaps.reverse() : sortedMaps;

    return (
        <>
            <Header />
            <main className="container py-3 maps-page">
                <aside className="maps-controls">
                    {/* <CategoriesList /> */}
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
                        <div className="mt-3">
                            <label className="form-label" htmlFor="map-sort">Sort by</label>
                            <select
                                className="form-select"
                                id="map-sort"
                                value={sortBy}
                                onChange={(event) => setSortBy(event.target.value)}
                            >
                                <option value="points">Points</option>
                                <option value="name">Name</option>
                                <option value="author">Author</option>
                                <option value="rating">My rating</option>
                            </select>
                        </div>
                        <div className="form-check mt-3">
                            <input
                                className="form-check-input"
                                id="reverse-order"
                                type="checkbox"
                                checked={reverseOrder}
                                onChange={(event) => setReverseOrder(event.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="reverse-order">Reverse order</label>
                        </div>
                        <fieldset className="mt-3">
                            <legend className="fs-6">Reviews</legend>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    id="show-reviewed"
                                    type="checkbox"
                                    checked={showReviewed}
                                    onChange={(event) => setShowReviewed(event.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="show-reviewed">Show reviewed</label>
                            </div>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    id="show-unreviewed"
                                    type="checkbox"
                                    checked={showUnreviewed}
                                    onChange={(event) => setShowUnreviewed(event.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="show-unreviewed">Show unreviewed</label>
                            </div>
                        </fieldset>
                    </div>
                </aside>
                <section className="maps-results" aria-label="Map results">
                    {isPending && <p role="status">Loading maps...</p>}
                    {error && <p role="alert">{error.message}</p>}
                    {!isPending && !error && reviewStatusErrors.length > 0 && (
                        <p role="alert">
                            Could not read review status for {reviewStatusErrors.length} map(s); those maps remain visible.
                        </p>
                    )}
                    {!isPending && !error && maps.length === 0 && <p>No maps found.</p>}
                    {!isPending && !error && maps.length > 0 && filteredMaps.length === 0 && <p>No maps match your search and review filters.</p>}
                    {!isPending && !error && filteredMaps.length > 0 && <MapList maps={filteredMaps} />}
                </section>
            </main>
        </>
    );
}
