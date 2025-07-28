import hashlib
import ecdsa
from ecdsa import VerifyingKey, SECP256k1
from ecdsa.util import sigdecode_der

def verify_vote(public_key_hex, vote_data, signature_hex):
    try:
        print("✅ 検証開始")

        # 🔧 先頭の '04' を除いた部分を使う（圧縮でない公開鍵）
        pub_key_bytes = bytes.fromhex(public_key_hex[2:])
        signature_bytes = bytes.fromhex(signature_hex)

        # 🔐 VerifyingKey オブジェクト生成
        vk = VerifyingKey.from_string(pub_key_bytes, curve=SECP256k1)

        # ✅ 検証処理（SHA256でハッシュし、DER形式の署名を検証）
        is_valid = vk.verify(
            signature_bytes,
            vote_data.encode(),
            hashfunc=hashlib.sha256,
            sigdecode=sigdecode_der,
        )

        print("✅ 検証成功:", is_valid)
        return is_valid

    except Exception as e:
        print("❌ 署名検証エラー:", e)
        return False
