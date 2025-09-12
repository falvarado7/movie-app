from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
from api.deps import get_reviews_service
from api.schemas.reviews import ReviewUpdate
from services.reviews_service import ReviewsService

router = APIRouter(prefix="/api/reviews", tags=["reviews"])

@router.delete("/{review_id}", status_code=204)
def delete_review(review_id: int, svc: ReviewsService = Depends(get_reviews_service)):
    ok = svc.delete(review_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Review cannot be found.")
    return  # 204

@router.put("/{review_id}")
def update_review(review_id: int, body: Dict[str, Any], svc: ReviewsService = Depends(get_reviews_service)):
    # Accept both {data:{...}} (old client) and {...}
    patch = body.get("data") if isinstance(body.get("data"), dict) else body
    updated = svc.update(review_id, patch or {})
    if not updated:
        raise HTTPException(status_code=404, detail="Review cannot be found.")
    return updated