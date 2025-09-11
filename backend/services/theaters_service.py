from typing import List, Dict, Any
from collections import defaultdict
from seeds.theaters_data import THEATERS_SEED
try:
    from seeds.movies_theaters_data import MOVIES_THEATERS_SEED
except Exception:
    MOVIES_THEATERS_SEED = []

class TheatersService:
    def __init__(self):
        self._theaters: List[Dict[str, Any]] = []
        for i, t in enumerate(THEATERS_SEED, start=1):
            if "theater_id" not in t:
                t = {**t, "theater_id": i}
            self._theaters.append(t)

        self._links = MOVIES_THEATERS_SEED

    def list(self, include_movies: bool = False, movies_index: Dict[int, Dict[str, Any]] | None = None):
        if not include_movies:
            return self._theaters

        movies_by_id = movies_index or {}
        by_theater = defaultdict(list)
        for link in self._links:
            if not link.get("is_showing", True):
                continue
            mid = link.get("movie_id")
            tid = link.get("theater_id")
            movie = movies_by_id.get(mid)
            if movie:
                # include is_showing + theater_id in each movie row
                by_theater[tid].append({
                    **movie,
                    "is_showing": True,
                    "theater_id": tid,
                })

        result = []
        for th in self._theaters:
            movies = by_theater.get(th["theater_id"], [])
            result.append({**th, "movies": movies})
        return result

    def theaters_for_movie(self, movie_id: int) -> List[Dict[str, Any]]:
        tid_set = {
            link["theater_id"]
            for link in self._links
            if link.get("movie_id") == movie_id and link.get("is_showing", True)
        }
        return [t for t in self._theaters if t["theater_id"] in tid_set]