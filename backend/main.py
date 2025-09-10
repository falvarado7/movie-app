from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Allow frontend to talk to backend in dev/prod
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory movies list
MOVIES = [
    {"id": 1, "title": "The Matrix"},
    {"id": 2, "title": "Inception"},
]

class MovieIn(BaseModel):
    title: str

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.get("/api/movies")
def list_movies():
    return MOVIES

@app.post("/api/movies")
def create_movie(movie: MovieIn):
    new_id = (MOVIES[-1]["id"] + 1) if MOVIES else 1
    obj = {"id": new_id, "title": movie.title}
    MOVIES.append(obj)
    return obj