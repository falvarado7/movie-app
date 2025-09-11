from pydantic import BaseModel
from typing import Optional, Dict, Any

class Review(BaseModel):
    review_id: int
    content: str
    score: int
    critic_id: int
    movie_id: int

class ReviewUpdate(BaseModel):
    content: Optional[str] = None
    score: Optional[int] = None

class ReviewWithCritic(Review):
    critic: Dict[str, Any]