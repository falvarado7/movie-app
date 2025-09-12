from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional, Dict, Any
from api.deps import get_movies_service, get_theaters_service, get_reviews_service
from services.movies_service import MoviesService
from services.theaters_service import TheatersService
from services.reviews_service import ReviewsService

router = APIRouter(prefix="/api/movies", tags=["movies"])

@router.get("", response_model=List[Dict[str, Any]])
def list_movies(is_showing: Optional[bool] = None,
                svc: MoviesService = Depends(get_movies_service)):
    return svc.list(is_showing)

@router.get("/{movie_id}", response_model=Dict[str, Any])
def read_movie(movie_id: int, svc: MoviesService = Depends(get_movies_service)):
    m = svc.get(movie_id)
    if not m:
        raise HTTPException(status_code=404, detail="Movie cannot be found.")
    return m

@router.get("/{movie_id}/theaters", response_model=List[Dict[str, Any]])
def movie_theaters(movie_id: int,
                   msvc: MoviesService = Depends(get_movies_service),
                   tsvc: TheatersService = Depends(get_theaters_service)):
    if not msvc.get(movie_id):
        raise HTTPException(status_code=404, detail="Movie cannot be found.")
    return tsvc.theaters_for_movie(movie_id)

@router.get("/{movie_id}/reviews", response_model=List[Dict,])
def movie_reviews(movie_id: int,
                  msvc: MoviesService = Depends(get_movies_service),
                  rsvc: ReviewsService = Depends(get_reviews_service)):
    if not msvc.get(movie_id):
        raise HTTPException(status_code=404, detail="Movie cannot be found.")
    return rsvc.list_for_movie(movie_id)