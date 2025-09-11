const BASE =
  (import.meta.env.VITE_API_URL || "/api")
    .replace(/\/$/, ""); // no trailing slash

const defaultHeaders = { "Content-Type": "application/json" };

/**
 * fetchJson:
 * - Accepts AbortSignal
 * - Returns payload.data (if present) or the payload itself
 * - Returns `onCancel` for AbortError
 * - If `onCancel` is provided and we get a 404,
 * - returns onCancel instead of throwing (useful for optional endpoints)
 */
async function fetchJson(path, { method = "GET", body, headers, signal } = {}, onCancel) {
    const url = path.startsWith("http") ? path : `${BASE}${path}`;
    try {
        const res = await fetch(url, {
            method,
            body,
            headers: { ...defaultHeaders, ...(headers || {}) },
            signal,
        });

        // 204 No Content
        if (res.status === 204) return null;

        // Optional: treat 404 as "not there yet" if caller provided onCancel
        if (res.status === 404 && typeof onCancel !== "undefined") return onCancel;

        if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(`${res.status} ${res.statusText}${text ? `: ${text}` : ""}`);
        }

        // Try JSON, fall back to text
        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) return res.text();

        const payload = await res.json();

        // Support both `{ data: ... }` (old API) and direct JSON (FastAPI defaults)
        return Object.prototype.hasOwnProperty.call(payload, "data") ? payload.data : payload;
    } catch (err) {
        if (err?.name === "AbortError") return onCancel;
        console.error(err);
        throw err;
    }
}

// ------- helpers -------

const getId = (movie) => movie.movie_id ?? movie.id;

// Optional population helpers; return [] if endpoint not implemented yet
function populateReviews(signal) {
    return async (movie) => {
        const id = getId(movie);
        const reviews = await fetchJson(`/movies/${id}/reviews`, { signal }, []);
        return { ...movie, reviews };
    };
}

function populateTheaters(signal) {
  return async (movie) => {
    const id = getId(movie);
    const theaters = await fetchJson(`/movies/${id}/theaters`, { signal }, []);
    return { ...movie, theaters };
  };
}

// -------- Public API --------

// list movies
export async function listMovies(signal) {
    return fetchJson(`/movies?is_showing=true`, { signal }, []);
}

// list all theaters; use include_movies to embed movies for each theater
export async function listTheaters(signal, { includeMovies = false } = {}) {
    const qs = includeMovies ? `?include_movies=true` : "";
    return fetchJson(`/theaters${qs}`, { signal }, []);
}

// convenience: fetch all theaters with movies and find one locally
export async function getTheaterById(theaterId, signal) {
    const all = await listTheaters(signal, { includeMovies: true });
    return all.find(t => String(t.theater_id) === String(theaterId)) || null;
}

// explicit “per movie” helpers (used by detail page)
export async function listTheatersForMovie(movieId, signal) {
    return fetchJson(`/movies/${movieId}/theaters`, { signal }, []);
}
export async function listReviewsForMovie(movieId, signal) {
    return fetchJson(`/movies/${movieId}/reviews`, { signal }, []);
}

// read one movie and also attach reviews + theaters
export async function readMovie(movieId, signal) {
    const movie = await fetchJson(`/movies/${movieId}`, { signal }, null);
    if (!movie) return null;
    const withReviews = await populateReviews(signal)(movie);
    return populateTheaters(signal)(withReviews);
}

// --- mutations (only if add matching FastAPI routes) ---
// NOTE: backend doesn’t implement these yet.
export async function deleteReview(reviewId) {
    return fetchJson(`/reviews/${reviewId}`, { method: "DELETE" }, {});
}
export async function updateReview(reviewId, data) {
    return fetchJson(`/reviews/${reviewId}`, { method: "PUT", body: JSON.stringify({ data }) }, {});
}