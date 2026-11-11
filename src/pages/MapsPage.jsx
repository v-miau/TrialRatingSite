import MapList from '../components/MapList.jsx';
import Header from '../components/Header.jsx';
import { useQuery } from '@tanstack/react-query';

const sheetId = '1TSgZRs_AT2Six0HaJXTWfQCsSmFu8RNKhK5MM4xIAhQ';
const sheetGid = '1676223853';

const mapCategories = [
    { name: 'Challenging', range: '5–10 points', min: 5, max: 10 },
    { name: 'Expert', range: '15–25 points', min: 15, max: 25 },
    { name: 'Hardcore', range: '30–45 points', min: 30, max: 45 },
    { name: 'Extreme', range: '50–95 points', min: 50, max: 95 },
    { name: 'Inhumane', range: '100–195 points', min: 100, max: 195 },
    { name: 'Nameless', range: '200+ points', min: 200, max: Infinity },
];

function CategoriesList() {
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

async function fetchMaps() {
    const url = new URL(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq`);
    url.searchParams.set('tqx', 'out:json');
    url.searchParams.set('gid', sheetGid);
    url.searchParams.set('tq', 'select B, C, D');

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Could not load maps (${response.status}).`);
    }

    const text = await response.text();
    const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?\s*$/);
    if (!match) {
        throw new Error('Google Sheets returned an unexpected response.');
    }

    const result = JSON.parse(match[1]);
    if (result.status !== 'ok') {
        throw new Error(result.errors?.[0]?.detailed_message || 'Google Sheets could not return the map list.');
    }

    return (result.table.rows ?? []).flatMap((row) => {
        const [map, points, author] = row.c ?? [];
        const id = String(map?.v ?? '').trim();
        if (!id || typeof points?.v !== 'number' || !String(author?.v ?? '').trim()) {
            return [];
        }

        return [{
            id,
            name: id.replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}\p{Emoji_Modifier}\uFE0F\u200D]/gu, '').replace(/\s+/g, ' ').trim(),
            points: String(points?.f ?? points?.v ?? ''),
            author: String(author.v).trim(),
            category: mapCategories.find(({ min, max }) => points.v >= min && points.v <= max)?.name ?? null,
        }];
    });
}

export default function MapsPage() {
    const { data: maps = [], isPending, error } = useQuery({
        queryKey: ['maps'],
        queryFn: fetchMaps,
        staleTime: 5 * 60 * 1000,
    });

    return (
        <>
            <Header />
            <main className="container py-3">
                <CategoriesList />
                {isPending && <p role="status">Loading maps...</p>}
                {error && <p role="alert">{error.message}</p>}
                {!isPending && !error && maps.length === 0 && <p>No maps found.</p>}
                {!isPending && !error && maps.length > 0 && <MapList maps={maps} />}
            </main>
        </>
    );
}
