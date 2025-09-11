from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
from api.schemas.reviews import ReviewUpdate
from services.reviews_service import ReviewsService

router = APIRouter(prefix="/api/reviews", tags=["reviews"])

def get_reviews_service(): return ReviewsService()

@router.put("/{review_id}", response_model=Dict[str, Any])
@router.put("/{review_id}", response_model=Dict[str, Any])
def update_review(
    review_id: int,
    patch: ReviewUpdate,
    svc: ReviewsService = Depends(get_reviews_service),
):
    updated = svc.update(review_id, patch.model_dump(exclude_none=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Review cannot be found.")
    return updated

@router.delete("/{review_id}", status_code=204)
def delete_review(
    review_id: int,
    svc: ReviewsService = Depends(get_reviews_service),
):
    ok = svc.delete(review_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Review cannot be found.")
    return