import { useEffect, useState } from 'react';
import RatingStars from '../components/RatingStars';
import { listReviewsForMovie, deleteReview } from '../lib/api';
import { Line } from '../components/Skeleton';
import { Trash2 } from 'lucide-react';

function ReviewCard({ review, onDelete }) {
    const critic = review.critic || {};
    return (
        <article className="rounded-2xl border border-zinc-400 dark:border-zinc-800 p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="font-medium">
                        {critic.preferred_name ?? critic.preferred_name?.trim() ?
                        critic.preferred_name : 'Anonymous'}
                    </p>
                    {critic.organization_name && (
                        <p className="text-xs text-zinc-500">{critic.organization_name}</p>
                    )}
                    <RatingStars value={review.score ?? 0} className="mt-1" />
                </div>
                <button
                    onClick={() => onDelete(review.review_id)}
                    className="
                        ring-focus inline-flex items-center gap-1 rounded-lg border
                        border-zinc-200/70 dark:border-zinc-800/70 px-2.5
                        py-1.5 text-xs text-zinc-600 dark:text-zinc-300
                        hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    title="Delete review"
                >
                    <Trash2 size={14}/> Delete
                </button>
            </div>
            {review.content && <p className="mt-3 text-sm leading-6">{review.content}</p>}
        </article>
    );
}

export default function ReviewsSection({ movieId }) {
    const [reviews, setReviews] = useState(null);
    const [error, setError] = useState(null);

    async function refresh(signal) {
        const data = await listReviewsForMovie(movieId, signal);
        return setReviews(data);
    }

    useEffect(() => {
        const ac = new AbortController();
        (async () => {
            try {
                await refresh(ac.signal);
            } catch (e) {
                if (!ac.signal.aborted) setError(e);
            }
        })();
        return () => ac.abort();
    }, [movieId]);

    async function handleDelete(id) {
        try {
            await deleteReview(id);
            await refresh(); // refetch without signal (we’re not unmounting)
        } catch (e) {
            alert(`Failed to delete: ${String(e.message || e)}`);
        }
    }

    return (
        <div className="card p-5">
            <h2 className="text-lg font-semibold">Reviews</h2>

            {error && <p className="mt-2 text-sm text-red-600">Failed to load reviews: {String(error.message || error)}</p>}

            {!reviews ? (
                <div className="mt-3 space-y-3">
                    <Line w="w-1/4" />
                    <Line />
                    <Line />
                </div>
            ) : reviews.length === 0 ? (
                <p className="mt-2 text-sm text-zinc-500">No reviews yet.</p>
            ) : (
                <div className="mt-3 grid gap-3">
                    {reviews.map(r => <ReviewCard key={r.review_id} review={r} onDelete={handleDelete} />)}
                </div>
            )}
        </div>
    );
}