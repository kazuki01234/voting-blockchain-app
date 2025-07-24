from fastapi import FastAPI
from api import vote, chain

app = FastAPI()

app.include_router(vote.router, prefix="/vote")
app.include_router(chain.router, prefix="/chain")


@app.get("/")
def root():
    return {"message": "電子投票システムAPI"}