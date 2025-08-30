import time, json, os
from .block import Block

DATA_FILE = "data/blockchain.json"


class Blockchain:
    def __init__(self):
        self.chain = []
        self.voted_public_keys = set()
        self.load()

    def create_genesis_block(self):
        return Block(0, "0", int(time.time()), votes=[])

    def get_latest_block(self):
        return self.chain[-1]

    def add_block(self, votes):
        for v in votes:
            if v['voter'] in self.voted_public_keys:
                raise ValueError(f"Public key {v['voter']} has already voted")

        prev_block = self.get_latest_block()
        new_block = Block(
            index=prev_block.index + 1,
            previous_hash=prev_block.hash,
            timestamp=int(time.time()),
            votes=votes
        )
        self.chain.append(new_block)

        for v in votes:
            self.voted_public_keys.add(v['voter'])

        self.save()
        return new_block

    def has_voted(self, public_key: str) -> bool:
        return public_key in self.voted_public_keys

    def save(self):
        data = {
            "chain": [b.to_dict() for b in self.chain],
            "voted_public_keys": list(self.voted_public_keys)
        }
        os.makedirs("data", exist_ok=True)
        with open(DATA_FILE, "w") as f:
            json.dump(data, f, indent=4)

    def load(self):
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, "r") as f:
                data = json.load(f)
                self.chain = [Block.from_dict(b) for b in data.get("chain", [])]
                self.voted_public_keys = set(data.get("voted_public_keys", []))
        else:
            genesis = self.create_genesis_block()
            self.chain = [genesis]
            self.voted_public_keys = set()
            self.save()
