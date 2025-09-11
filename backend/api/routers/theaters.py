from fastapi import APIRouter, Depends
from typing import List, Dict, Any
from services.theaters_service import TheatersService
from services.movies_service import MoviesService

router = APIRouter(prefix="/api/theaters", tags=["theaters"])

def get_theaters_service(): return TheatersService()
def get_movies_service(): return MoviesService()

@router.get("", response_model=List[Dict[str, Any]])
def list_theaters(
    tsvc: TheatersService = Depends(get_theaters_service),
    msvc: MoviesService = Depends(get_movies_service),
):
    movies_index = {m["movie_id"]: m for m in msvc.list()}
    return tsvc.list(include_movies=True, movies_index=movies_index)