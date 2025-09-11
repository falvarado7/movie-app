from pydantic import BaseModel
from typing import Optional, List

class Movie(BaseModel):
    id: int
    title: str
    runtime_in_minutes: Optional[int] = None
    rating: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None

class MovieListResponse(BaseModel):
    pass