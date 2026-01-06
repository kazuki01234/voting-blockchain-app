# backend_python/crypto/zkp.py
import hashlib
from typing import Dict

def generate_proof(*args, **kwargs):
    raise NotImplementedError("Proof generation is client-side only")

def verify_proof(proof: str) -> bool:
    """
    proof が
    - 投票内容が正しい形式である
    - ルールを満たしている
    ことを証明しているかを検証する

    ※ 現在はスタブ
    """
    return isinstance(proof, str) and len(proof) == 64

