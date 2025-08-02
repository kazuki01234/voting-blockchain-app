from fastapi import APIRouter
from collections import Counter
from blockchain.shared import blockchain
from typing import Dict

router = APIRouter()

@router.get("/")
def get_chain():
    return [vars(block) for block in blockchain.chain]

@router.get("/results")
def get_results() -> Dict[str, int]:
    votes = []

    for block in blockchain.chain:
        for tx in block.votes:
            vote = tx.get("vote")
            if vote:
                votes.append(vote)

    results = Counter(votes)  # 例: {"Python": 3, "JavaScript": 1}
    return dict(results)