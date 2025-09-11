from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routers import movies, theaters, reviews

app = FastAPI()

# Allow frontend to talk to backend in dev/prod
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(movies.router)
app.include_router(theaters.router)
app.include_router(reviews.router)

@app.get("/api/health")
def health():
    return {"status": "ok"}
