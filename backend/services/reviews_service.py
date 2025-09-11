from typing import List, Dict, Any, Optional
from seeds.reviews_data import REVIEWS_SEED
from seeds.critics_data import CRITICS_SEED

class ReviewsService:
    def __init__(self):
        self._reviews: List[Dict[str, Any]] = []
        for i, r in enumerate(REVIEWS_SEED, start=1):
            if "review_id" not in r:
                r = {**r, "review_id": i}
            self._reviews.append(r)

        self._critics_by_id = {c["critic_id"]: c for c in CRITICS_SEED}

    def list_for_movie(self, movie_id: int) -> List[Dict[str, Any]]:
        out = []
        for r in self._reviews:
            if r["movie_id"] == movie_id:
                critic = self._critics_by_id.get(r["critic_id"], {})
                out.append({**r, "critic": critic})
        return out

    def update(self, review_id: int, patch: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        for idx, r in enumerate(self._reviews):
            if r["review_id"] == review_id:
                updated = {**r, **{k: v for k, v in patch.items() if v is not None}}
                self._reviews[idx] = updated
                critic = self._critics_by_id.get(updated["critic_id"], {})
                return {**updated, "critic": critic}
        return None

    def delete(self, review_id: int) -> bool:
        for idx, r in enumerate(self._reviews):
            if r["review_id"] == review_id:
                self._reviews.pop(idx)
                return True
        return False