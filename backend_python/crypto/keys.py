import hashlib
from ecdsa import VerifyingKey, SECP256k1
from ecdsa.util import sigdecode_der

def verify_signature(public_key_hex: str, message: str, signature_hex: str) -> bool:
    """
    公開鍵によって、message（= proof）が
    本人によって署名されたかを検証する
    """
    try:
        # 0x04 プレフィックスを想定して除去
        pub_key_bytes = bytes.fromhex(public_key_hex[2:])
        signature_bytes = bytes.fromhex(signature_hex)

        vk = VerifyingKey.from_string(pub_key_bytes, curve=SECP256k1)

        return vk.verify(
            signature_bytes,
            message.encode(),
            hashfunc=hashlib.sha256,
            sigdecode=sigdecode_der,
        )

    except Exception:
        return False

def hash_public_key(pubkey: str) -> str:
    return hashlib.sha256(pubkey.encode()).hexdigest()