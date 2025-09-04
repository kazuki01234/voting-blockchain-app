from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import vote, chain

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(vote.router, prefix="/vote")
app.include_router(chain.router, prefix="/chain")


@app.get("/")
def root():
    return {"message": "Blockchain-based Voting System API"}