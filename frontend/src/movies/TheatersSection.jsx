import { useEffect, useState } from 'react';
import { listTheatersForMovie } from '../lib/api';
import { Line, Card } from '../components/Skeleton';

export default function TheatersSection({ movieId }) {
    const [theaters, setTheaters] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const ac = new AbortController();
        (async () => {
            try {
                const data = await listTheatersForMovie(movieId, ac.signal);
                if (!ac.signal.aborted) setTheaters(data);
            } catch (e) {
                if (!ac.signal.aborted) setError(e);
            }
        })();
        return () => ac.abort();
    }, [movieId]);

    return (
        <div className="card p-5">
            <h2 className="text-lg font-semibold">Where to watch</h2>

            {error && <p className="mt-2 text-sm text-red-600">Failed to load theaters: {String(error.message || error)}</p>}

            {!theaters ? (
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <Card><Line w="w-1/2"/><Line className="mt-2" /></Card>
                    <Card><Line w="w-1/3"/><Line className="mt-2" /></Card>
                </div>
            ) : theaters.length === 0 ? (
                <p className="mt-2 text-sm text-zinc-500">No showtimes currently.</p>
            ) : (
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {theaters.map(t => (
                        <li key={t.theater_id} className="rounded-xl border border-zinc-400 dark:border-zinc-800 p-3">
                            <p className="font-medium">{t.name}</p>
                            <p className="text-xs text-zinc-500">
                                {t.address_line_1}{t.address_line_2 ? `, ${t.address_line_2}` : ''}, {t.city}, {t.state} {t.zip}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}