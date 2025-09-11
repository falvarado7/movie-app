import { useEffect, useState } from 'react';
import { listMovies } from '../lib/api';
import MovieCard, { MovieCardSkeleton } from '../components/MovieCard';

export default function MoviesList() {
    const [movies, setMovies] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const ac = new AbortController();
        (async () => {
            try {
                const data = await listMovies(ac.signal);
                if (!ac.signal.aborted) setMovies(data);
            } catch (e) {
                if (!ac.signal.aborted) setError(e);
            }
        })();
        return () => ac.abort();
    }, []);

    if (error) {
        return (
            <div className="mx-auto max-w-lg">
                <div className="card p-4">
                    <p className="text-red-600">Failed to load: {String(error.message || error)}</p>
                </div>
            </div>
        );
    }

    if (!movies) {
        return (
            <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => <MovieCardSkeleton key={i} />)}
            </section>
        );
    }

    return (
        <>
            <div className="mb-4 flex items-end justify-between">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">Now Showing</h2>
                    <p className="text-sm text-zinc-500">Fresh picks powered by your FastAPI backend</p>
                </div>
            </div>

            <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {movies.map(m => <MovieCard key={m.id ?? m.movie_id} movie={m} />)}
            </section>
        </>
    );
}