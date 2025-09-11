from __future__ import annotations
import random

# If movie/theater seeds already exist, import them:
try:
    from seeds.movies_data import MOVIES_SEED
except Exception:
    MOVIES_SEED = []

try:
    from seeds.theaters_data import THEATERS_SEED
except Exception:
    THEATERS_SEED = []

def _with_ids(items, key_name):
    out = []
    for i, item in enumerate(items, start=1):
        if key_name not in item:
            out.append({**item, key_name: i})
        else:
            out.append(item)
    return out

# ensures each movie is in at least one theater, then adds random number of extra movies
def generate_movies_theaters_joins(movies, theaters, *, min_extra=1, max_extra=3, stable=False):
    if stable:
        random.seed(42) # makes the randomization consistent across runs

    joins = []
    seen = set() # (movie_id, theater_id)

    mids = [m["movie_id"] for m in movies]
    tids = [t["theater_id"] for t in theaters]
    if not mids or not tids:
        return joins

    # Coverage: every movie appears in at least one random theater
    for mid in mids:
        tid = random.choice(tids)
        if (mid, tid) not in seen:
            joins.append({"movie_id": mid, "theater_id": tid, "is_showing": True})
            seen.add((mid, tid))

    # Variety: each theater gets a few extra movies
    for tid in tids:
        # make a pool of movies not already assigned to this theater
        available = [mid for mid in mids if (mid, tid) not in seen]
        if not available:
            continue
        extra_count = random.randint(min_extra, min(max_extra, len(available)))
        for mid in random.sample(available, extra_count):
            joins.append({"movie_id": mid, "theater_id": tid, "is_showing": True})
            seen.add((mid, tid))

    return joins

# Normalize IDs in case other seeds don’t explicitly set them
_MOVIES = _with_ids(MOVIES_SEED, "movie_id")
_THEATERS = _with_ids(THEATERS_SEED, "theater_id")

# Exported seed array (import this from services)
MOVIES_THEATERS_SEED = generate_movies_theaters_joins(_MOVIES, _THEATERS)