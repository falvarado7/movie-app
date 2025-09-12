import { Link } from 'react-router-dom';

export default function MovieCard({ movie }) {
    return (
        <article className="card card-hover overflow-hidden">
            <Link to={`/movies/${movie.id ?? movie.movie_id}`} className="block">
                <div className="relative aspect-[2/3]">
                    <img
                        src={movie.image_url}
                        alt={`${movie.title} poster`}
                        className="absolute inset-0 h-full w-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                </div>
                <div className="p-3">
                    <h3 className="line-clamp-1 text-base font-semibold tracking-tight">{movie.title}</h3>
                    <p className="mt-1 text-xs text-zinc-500">
                        {movie.rating ?? 'NR'} · {movie.runtime_in_minutes ?? '—'} min
                    </p>
                </div>
            </Link>
        </article>
    );
}

export function MovieCardSkeleton() {
    return (
        <div className="card overflow-hidden animate-pulse">
            <div className="aspect-[2/3]" />
            <div className="p-3 space-y-2">
                <div className="h-4 w-3/4 rounded" />
                <div className="h-3 w-1/3 rounded" />
            </div>
        </div>
    );
}