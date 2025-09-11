import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listMovies } from '../lib/api';
import { Line } from '../components/Skeleton';

function truncate(s, n = 220) {
    if (!s) return '';
    return s.length > n ? s.slice(0, n).trimEnd() + '…' : s;
}

export default function MoviesIndex() {
    const [movies, setMovies] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const ac = new AbortController();
        (async () => {
        try {
            const data = await listMovies(ac.signal);
            if (!ac.signal.aborted) setMovies(data);
        } catch (e) { if (!ac.signal.aborted) setError(e); }
        })();
        return () => ac.abort();
    }, []);

    return (
        <main className="container py-6 space-y-4">
            <h1 className="text-2xl font-bold tracking-tight">All Movies</h1>

            {error && <p className="text-red-600">Failed: {String(error.message || error)}</p>}

            {!movies ? (
                <div className="space-y-3">
                    {Array.from({length:4}).map((_,i)=>
                        <div key={i} className="card p-4 flex gap-4">
                            <div className="h-32 w-24 rounded bg-zinc-200/70 dark:bg-zinc-800/70 animate-pulse"/>
                            <div className="flex-1">
                                <Line w="w-1/3" />
                                <Line className="mt-2" />
                                <Line className="mt-2" />
                            </div>
                        </div>
                    )}
                </div>
            ) : movies.length === 0 ? (
                <p className="text-sm text-zinc-500">No movies found.</p>
            ) : (
                <ul className="space-y-3">
                    {movies.map(m => (
                        <li key={m.movie_id ?? m.id} className="card p-4 flex gap-4">
                            <div className="shrink-0">
                                <div className="h-32 w-24 overflow-hidden rounded bg-zinc-400 dark:bg-zinc-800">
                                    <img src={m.image_url} alt="" className="h-full w-full object-cover" />
                                </div>
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{m.title}</h3>
                                <p className="mt-1 text-xs text-zinc-500">
                                    {(m.rating ?? 'NR')} · {(m.runtime_in_minutes ?? '—')} min
                                </p>
                                {m.description && (
                                    <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                                        {truncate(m.description)}
                                    </p>
                                )}
                                <div className="mt-3">
                                    <Link
                                        to={`/movies/${m.movie_id ?? m.id}`}
                                        className="
                                            ring-focus inline-flex items-center gap-1 rounded-xl
                                            border border-zinc-400 dark:border-zinc-800
                                            px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900"
                                    >
                                        See more →
                                    </Link>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}