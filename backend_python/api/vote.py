from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from crypto.keys import verify_vote
from blockchain.shared import blockchain

router = APIRouter()

class VoteRequest(BaseModel):
    voter_public_key: str
    vote_data: str
    signature: str

@router.post("/")
def submit_vote(vote: VoteRequest):
    if not verify_vote(vote.voter_public_key, vote.vote_data, vote.signature):
        raise HTTPException(status_code=400, detail="Invalid signature")

    if blockchain.has_voted(vote.voter_public_key):
        raise HTTPException(status_code=400, detail="This public key has already voted")

    try:
        blockchain.add_block([{
            "voter": vote.voter_public_key,
            "vote": vote.vote_data,
            "signature": vote.signature
        }])
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {"message": "Vote added to blockchain"}
