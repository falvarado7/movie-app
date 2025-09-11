from typing import List, Dict, Any, Optional
try:
    from seeds.movies_theaters_data import MOVIES_THEATERS_SEED
except Exception:
    MOVIES_THEATERS_SEED = []

class MoviesService:
    def __init__(self):
        self._movies: List[Dict[str, Any]] = []
        from seeds.movies_data import MOVIES_SEED
        for i, m in enumerate(MOVIES_SEED, start=1):
            if "movie_id" not in m:
                m = {**m, "movie_id": i}
            self._movies.append(m)

        # precompute ids of movies currently showing
        self._showing_ids = {
            link["movie_id"]
            for link in MOVIES_THEATERS_SEED
            if link.get("is_showing", True)
        }

    def list(self, is_showing: Optional[bool] = None) -> List[Dict[str, Any]]:
        if is_showing is True:
            return [m for m in self._movies if m["movie_id"] in self._showing_ids]
        return self._movies

    def get(self, movie_id: int) -> Optional[Dict[str, Any]]:
        return next((m for m in self._movies if m["movie_id"] == movie_id), None)