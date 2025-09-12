from services.movies_service import MoviesService
from services.theaters_service import TheatersService
from services.reviews_service import ReviewsService

# SINGLETONS (one per process)
_movies = MoviesService()
_theaters = TheatersService()
_reviews = ReviewsService()

def get_movies_service() -> MoviesService:
    return _movies

def get_theaters_service() -> TheatersService:
    return _theaters

def get_reviews_service() -> ReviewsService:
    return _reviews