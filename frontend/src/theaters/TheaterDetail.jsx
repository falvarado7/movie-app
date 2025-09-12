import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTheaterById, } from '../lib/api';
import { Line } from '../components/Skeleton';

export default function TheaterDetail() {
    const { id } = useParams();
    const [theater, setTheater] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const ac = new AbortController();
        (async () => {
            try { const th = await getTheaterById(id, ac.signal); if (!ac.signal.aborted) setTheater(th); }
            catch (e) { if (!ac.signal.aborted) setError(e); }
        })();
        return () => ac.abort();
    }, [id]);

    if (error) return <p className="text-red-600">Failed: {String(error.message || error)}</p>;

    return (
        <main className="container py-6 space-y-4">
            {!theater ? (
                <div className="card p-5"><Line w="w-1/3"/><Line className="mt-2"/></div>
            ) : (
                <>
                    <div className="card p-5">
                        <h1 className="text-2xl font-bold tracking-tight">{theater.name}</h1>
                        <p className="mt-1 text-sm text-zinc-500">
                            {theater.address_line_1}{theater.address_line_2?`, ${theater.address_line_2}`:''}, {theater.city}, {theater.state} {theater.zip}
                        </p>
                    </div>

                    <div className="card p-5">
                        <h2 className="text-lg font-semibold">Now Showing</h2>
                            {!theater.movies || theater.movies.length === 0 ? (
                        <p className="mt-2 text-sm text-zinc-500">No showings right now.</p>
                        ) : (
                        <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {theater.movies.map(m => (
                                <li key={m.movie_id} className="card-hover rounded-xl border border-zinc-400 dark:border-zinc-800 overflow-hidden">
                                    <Link to={`/movies/${m.movie_id}`} className="block">
                                        <div className="aspect-[3/4] bg-zinc-400 dark:bg-zinc-800">
                                            <img src={m.image_url} alt="" className="h-full w-full object-cover" />
                                        </div>
                                        <div className="p-3">
                                            <p className="font-medium">{m.title}</p>
                                            <p className="text-xs text-zinc-500 mt-1">{m.rating ?? 'NR'} · {m.runtime_in_minutes ?? '—'} min</p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        )}
                    </div>
                </>
            )}
        </main>
    );
}