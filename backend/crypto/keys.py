import ecdsa
from ecdsa import SigningKey, VerifyingKey, SECP256k1

def generate_keys():
    sk = SigningKey.generate(curve=SECP256k1)
    vk = sk.get_verifying_key()
    return sk, vk

def sign_vote(private_key, vote_data):
    return private_key.sign(vote_data.encode()).hex()

def verify_vote(public_key_hex, vote_data, signature_hex):
    vk = VerifyingKey.from_string(bytes.fromhex(public_key_hex), curve=SECP256k1)
    try:
        return vk.verify(bytes.fromhex(signature_hex), vote_data.encode())
    except:
        return False