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
    print("Received vote_data:", vote.vote_data)
    print("Received voter_public_key:", vote.voter_public_key)
    print("Received signature:", vote.signature)

    if not verify_vote(vote.voter_public_key, vote.vote_data, vote.signature):
        print("Signature verification failed")
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    blockchain.add_block([{
        'vote': vote.vote_data,
        'signature': vote.signature,
        'voter': vote.voter_public_key
    }])
    
    return {"message": "Vote added to blockchain"}
