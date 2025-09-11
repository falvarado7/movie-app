import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listTheaters } from '../lib/api';
import { Line } from '../components/Skeleton';

export default function TheatersList() {
    const [theaters, setTheaters] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const ac = new AbortController();
        (async () => {
            try { const data = await listTheaters(ac.signal); if (!ac.signal.aborted) setTheaters(data); }
            catch (e) { if (!ac.signal.aborted) setError(e); }
        })();
        return () => ac.abort();
    }, []);

    return (
        <main className="container py-6 space-y-4">
            <h1 className="text-2xl font-bold tracking-tight">Theaters</h1>

            {error && <p className="text-red-600">Failed: {String(error.message || error)}</p>}

            {!theaters ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({length:6}).map((_,i)=>
                        <div key={i} className="card p-4"><Line w="w-1/3"/><Line className="mt-2"/></div>
                    )}
                </div>
            ) : theaters.length === 0 ? (
                <p className="text-sm text-zinc-500">No theaters found.</p>
            ) : (
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {theaters.map(t => (
                        <li key={t.theater_id} className="card p-4">
                            <h3 className="font-semibold">{t.name}</h3>
                            <p className="mt-1 text-xs text-zinc-500">
                                {t.address_line_1}{t.address_line_2?`, ${t.address_line_2}`:''}, {t.city}, {t.state} {t.zip}
                            </p>
                            <Link to={`/theaters/${t.theater_id}`} className="mt-3 inline-flex text-sm text-brand-600 hover:underline">
                                View showings →
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}