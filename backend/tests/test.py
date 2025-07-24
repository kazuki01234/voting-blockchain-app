from blockchain.blockchain import Blockchain
from crypto.keys import generate_keys, sign_vote, verify_vote

# 鍵生成
sk, vk = generate_keys()
vote_data = "Alice->CandidateX"
signature = sign_vote(sk, vote_data)

# 投票と検証
assert verify_vote(vk.to_string().hex(), vote_data, signature)

# ブロックチェーン作成と追加
bc = Blockchain()
bc.add_block([{
    'vote': vote_data,
    'signature': signature,
    'voter': vk.to_string().hex()
}])

# 検証
print("ブロックチェーンの正当性:", bc.is_valid_chain())

# ブロックチェーンの内容を表示
print([block.to_dict() for block in bc.chain])