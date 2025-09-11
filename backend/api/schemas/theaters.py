from pydantic import BaseModel
from typing import Optional, List
from .movies import Movie

class Theater(BaseModel):
    id: int
    name: str
    address_line_1: str
    address_line_2: Optional[str] = ""
    city: str
    state: str
    zip: str

class TheaterWithMovies(Theater):
    movies: List[dict] = []