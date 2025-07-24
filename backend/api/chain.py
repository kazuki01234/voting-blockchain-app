from fastapi import APIRouter
from blockchain.blockchain import Blockchain

router = APIRouter()
blockchain = Blockchain()

@router.get("/")
def get_chain():
    return [vars(block) for block in blockchain.chain]
