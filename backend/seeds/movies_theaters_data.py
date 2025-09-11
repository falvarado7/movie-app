from __future__ import annotations

# If your movie/theater seeds already exist, import them:
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

def generate_movies_theaters_joins(movies, theaters):
    joins = []
    for m in movies:
        mid = m.get("movie_id")
        for t in theaters:
            tid = t.get("theater_id")
            if tid:
                joins.append({
                    "movie_id": mid,
                    "theater_id": tid,
                    "is_showing": True,
                })
    return joins

# Normalize IDs in case other seeds don’t explicitly set them
_MOVIES = _with_ids(MOVIES_SEED, "movie_id")
_THEATERS = _with_ids(THEATERS_SEED, "theater_id")

# Exported seed array (import this from services)
MOVIES_THEATERS_SEED = generate_movies_theaters_joins(_MOVIES, _THEATERS)