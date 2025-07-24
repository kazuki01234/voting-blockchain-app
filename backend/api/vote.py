from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from crypto.keys import sign_vote, verify_vote
from blockchain.blockchain import Blockchain

router = APIRouter()
blockchain = Blockchain()

# 投票データの受け取り形式
class VoteRequest(BaseModel):
    voter_public_key: str
    vote_data: str
    signature: str

@router.post("/")
def submit_vote(vote: VoteRequest):
    if not verify_vote(vote.voter_public_key, vote.vote_data, vote.signature):
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    # ブロックに追加
    blockchain.add_block([{
        'vote': vote.vote_data,
        'signature': vote.signature,
        'voter': vote.voter_public_key
    }])
    
    return {"message": "Vote added to blockchain"}