import json
from pathlib import Path
from crypto.keys import generate_keys

# 保存先
output_path = Path(__file__).parent / "data" / "voters.json"

# 登録するユーザー名（必要に応じて増やす）
usernames = ["Alice", "Bob"]

voters = []
for name in usernames:
    sk, vk = generate_keys()
    voters.append({
        "name": name,
        "public_key": vk.to_string().hex(),
        "private_key": sk.to_string().hex()
    })

# dataディレクトリがなければ作る
output_path.parent.mkdir(exist_ok=True)

# 保存
with open(output_path, "w") as f:
    json.dump(voters, f, indent=4)

print(f"✅ {len(voters)}名分の鍵を {output_path} に保存しました。")