import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { readMovie } from '../lib/api';
import TheatersSection from './TheatersSection';
import ReviewsSection from './ReviewsSection';

export default function MovieDetail() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const ac = new AbortController();
        (async () => {
            try {
                const m = await readMovie(id, ac.signal);
                if (!ac.signal.aborted) setMovie(m);
            } catch (e) {
                if (!ac.signal.aborted) setError(e);
            }
        })();
        return () => ac.abort();
    }, [id]);

    if (error) return <p className="text-red-600">Failed: {String(error.message || error)}</p>;
    if (!movie) return <div className="card p-6 animate-pulse h-64" />;

    return (
        <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-start">
            <div className="card overflow-hidden">
                <div className="aspect-[2/3] bg-zinc-200/80 dark:bg-zinc-800/60">
                    <img alt="" src={movie.image_url} className="h-full w-full object-cover rounded" />
                </div>
            </div>

            <div className="space-y-4">
                <div className="card p-5">
                    <h1 className="text-2xl font-bold tracking-tight">{movie.title}</h1>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                        {movie.rating ?? 'NR'} · {movie.runtime_in_minutes ?? '—'} min
                    </p>
                    {movie.description && <p className="mt-4 text-sm leading-6">{movie.description}</p>}
                </div>
                <TheatersSection movieId={id} />
            </div>
            <div className="md:col-span-2">
                <ReviewsSection movieId={id} />
            </div>
        </div>
    );
}