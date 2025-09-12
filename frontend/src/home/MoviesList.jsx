import React, { useEffect, useMemo, useState, useDeferredValue } from 'react';
import { useSearchParams } from 'react-router-dom';
import { listMovies } from '../lib/api';
import MovieCard, { MovieCardSkeleton } from '../components/MovieCard';

export default function MoviesList() {
    const [movies, setMovies] = useState(null);
    const [error, setError] = useState(null);
    const [params] = useSearchParams();
    const q = (params.get('q') || '').trim();
    const dq = useDeferredValue(q);

    useEffect(() => {
        const ac = new AbortController();
        (async () => {
            try {
                const list = await listMovies(ac.signal);
                if (!ac.signal.aborted) setMovies(list);
            } catch (e) {
                if (!ac.signal.aborted) setError(e);
            }
        })();
        return () => ac.abort();
    }, []);

    const filtered = useMemo(() => {
        if (!movies) return null;
        if (!dq) return movies;
        const tokens = dq.toLowerCase().split(/\s+/).filter(Boolean);
        return movies.filter(m => {
        const title = (m.title || '').toLowerCase();
        return tokens.every(t => title.includes(t));
        });
    }, [movies, dq]);

    if (error) return <p className="text-red-600">Failed: {String(error.message || error)}</p>;
    if (!movies) {
        return (
            <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => <MovieCardSkeleton key={i} />)}
            </section>
        );
    }

    return (
        <main>
            <div className="mb-4 flex justify-between">
                <h2 className="text-2xl font-semibold">Now Showing</h2>
                {q && <p className="text-xs text-zinc-500">Search: “{q}” · {filtered.length} / {movies?.length ?? 0}</p>}
            </div>

            {filtered.length === 0 ? (
                <div className="card p-6 text-sm text-zinc-600 dark:text-zinc-300">
                    No movies match <strong>“{q}”</strong>. Try fewer keywords or different terms.
                </div>
            ) : (
                <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filtered.map((movie) => ( <MovieCard key={movie.id ?? movie.movie_id} movie={movie}/>))}
                </section>
            )}
        </main>
    );
}