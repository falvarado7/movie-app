import { useEffect, useState } from 'react';
import RatingStars from '../components/RatingStars';
import { listReviewsForMovie, deleteReview, updateReview } from '../lib/api';
import { Line } from '../components/Skeleton';
import { Check, Pencil, Trash2, X } from 'lucide-react';

function ReviewCard({ review, onDelete, onUpdate }) {
    const critic = review.critic || {};
    const displayName = (critic.preferred_name && critic.preferred_name.trim()) || 'Anonymous';
    const [editing, setEditing] = useState(false);
    const [content, setContent]   = useState(review.content || '');
    const [score, setScore]       = useState(review.score ?? 0);
    const [saving, setSaving]     = useState(false);
    const [err, setErr]           = useState(null);

    const startEdit = () => {
        setErr(null);
        setContent(review.content || '');
        setScore(review.score ?? 0);
        setEditing(true);
    };

    const cancel = () => {
        setEditing(false);
        setErr(null);
    };

    const save = async () => {
        setSaving(true);
        setErr(null);
        try {
        await onUpdate(review.review_id, { content, score: Number(score) });
        setEditing(false);
        } catch (e) {
        setErr(String(e?.message || e));
        } finally {
        setSaving(false);
        }
    };
    return (
        <article className="rounded-2xl border border-zinc-400 dark:border-zinc-800 p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="font-medium">{displayName}</p>
                    {critic.organization_name && (
                        <p className="text-xs text-zinc-500">{critic.organization_name}</p>
                    )}

                    {!editing ? (
                        <RatingStars value={review.score ?? 0} className="mt-1" />
                    ) : (
                        <div className="mt-2 flex items-center gap-2">
                            <label className="text-xs text-zinc-500">Score</label>
                            <select
                                className="rounded-lg border border-zinc-400 dark:border-zinc-800 bg-transparent px-2 py-1 text-sm"
                                value={score}
                                onChange={(e) => setScore(e.target.value)}
                            >
                                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>
                    )}
                </div>

                {!editing ? (
                    <div className="flex gap-2">
                        <button
                            onClick={startEdit}
                            className="ring-focus inline-flex items-center gap-1 rounded-lg border border-zinc-400 dark:border-zinc-800 px-2.5 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                            title="Edit review"
                        >
                            <Pencil size={14}/> Edit
                        </button>
                        <button
                            onClick={() => onDelete(review.review_id)}
                            className="ring-focus inline-flex items-center gap-1 rounded-lg border border-zinc-400 dark:border-zinc-800 px-2.5 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                            title="Delete review"
                        >
                            <Trash2 size={14}/> Delete
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={cancel}
                            className="ring-focus inline-flex items-center gap-1 rounded-lg border border-zinc-400 dark:border-zinc-800 px-2.5 py-1.5 text-xs"
                        >
                            <X size={14}/> Cancel
                        </button>
                        <button
                            onClick={save}
                            disabled={saving}
                            className="ring-focus inline-flex items-center gap-1 rounded-lg border border-zinc-400 dark:border-zinc-800 px-2.5 py-1.5 text-xs bg-brand-600 text-white disabled:opacity-60"
                        >
                            <Check size={14}/> {saving ? 'Saving…' : 'Save'}
                        </button>
                    </div>
                )}
            </div>

            {!editing ? (
                review.content && <p className="mt-3 text-sm leading-6 whitespace-pre-line">{review.content}</p>
            ) : (
                <div className="mt-3">
                    <textarea
                        className="ring-focus w-full rounded-xl border border-zinc-400 dark:border-zinc-800 bg-transparent p-3 text-sm"
                        rows={4}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Update your review…"
                    />
                    {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
                </div>
            )}
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

    const handleUpdate = async (id, patch) => {
        // optimistic
        const prev = reviews;
        setReviews(r => r.map(x => x.review_id === id ? { ...x, ...patch } : x));
        try {
            const updated = await updateReview(id, patch); // backend returns full review (+ critic)
            setReviews(r => r.map(x => x.review_id === id ? updated : x));
        } catch (e) {
            setError(e);
            setReviews(prev);
            throw e;
        }
    };

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
                    {reviews.map(r =>
                        <ReviewCard
                            key={r.review_id}
                            review={r}
                            onDelete={handleDelete}
                            onUpdate={handleUpdate}
                        />
                    )}
                </div>
            )}
        </div>
    );
}