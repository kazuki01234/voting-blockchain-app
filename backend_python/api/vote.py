from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from crypto.keys import verify_signature, hash_public_key
from crypto.zkp import verify_proof
from blockchain.shared import blockchain

router = APIRouter()

class VoteRequest(BaseModel):
    voter_public_key: str
    proof: str
    signature: str

@router.post("/")
def submit_vote(vote: VoteRequest):

    voter_hash = hash_public_key(vote.voter_public_key)

    if not verify_signature(
        vote.voter_public_key,
        f"{vote.proof}|{voter_hash}",
        vote.signature
    ):
        raise HTTPException(status_code=400, detail="Invalid signature")

    if blockchain.has_voted(voter_hash):
        raise HTTPException(status_code=400, detail="This voter has already voted")

    if not verify_proof(vote.proof):
        raise HTTPException(status_code=400, detail="Invalid ZKP proof")

    blockchain.add_block([{
        "voter_hash": voter_hash,
        "proof": vote.proof,
        "proof_valid": True
    }])

    return {"message": "Vote added to blockchain"}
