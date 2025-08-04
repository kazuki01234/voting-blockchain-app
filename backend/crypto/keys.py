import hashlib
import ecdsa
from ecdsa import VerifyingKey, SECP256k1
from ecdsa.util import sigdecode_der

def verify_vote(public_key_hex, vote_data, signature_hex):
    try:
        pub_key_bytes = bytes.fromhex(public_key_hex[2:])
        signature_bytes = bytes.fromhex(signature_hex)

        vk = VerifyingKey.from_string(pub_key_bytes, curve=SECP256k1)

        is_valid = vk.verify(
            signature_bytes,
            vote_data.encode(),
            hashfunc=hashlib.sha256,
            sigdecode=sigdecode_der,
        )
        return is_valid

    except Exception:
        return False
