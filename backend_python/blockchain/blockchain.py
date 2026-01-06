import time, json, os
from .block import Block

DATA_FILE = "data/blockchain.json"


class Blockchain:
    def __init__(self):
        self.chain = []
        self.voted_hashes = set()
        self.load()

    def create_genesis_block(self):
        return Block(0, "0", int(time.time()), votes=[])

    def get_latest_block(self):
        return self.chain[-1]

    def has_voted(self, voter_hash: str) -> bool:
        return voter_hash in self.voted_hashes

    def add_block(self, votes):
        """
        votes: List[{
            voter_hash: str,
            proof: str,
            proof_valid: bool
        }]
        """

        # proof_valid チェック
        for v in votes:
            if not v.get("proof_valid", False):
                raise ValueError("Invalid proof detected")

        # 1人1票チェック（voter_hash）
        for v in votes:
            if v["voter_hash"] in self.voted_hashes:
                raise ValueError("This voter has already voted")

        prev_block = self.get_latest_block()

        new_block = Block(
            index=prev_block.index + 1,
            previous_hash=prev_block.hash,
            timestamp=int(time.time()),
            votes=votes
        )

        self.chain.append(new_block)

        # 投票済みとして記録
        for v in votes:
            self.voted_hashes.add(v["voter_hash"])

        self.save()
        return new_block

    def save(self):
        data = {
            "chain": [b.to_dict() for b in self.chain],
            "voted_hashes": list(self.voted_hashes)
        }
        os.makedirs("data", exist_ok=True)
        with open(DATA_FILE, "w") as f:
            json.dump(data, f, indent=4)

    def load(self):
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, "r") as f:
                data = json.load(f)
                self.chain = [Block.from_dict(b) for b in data.get("chain", [])]
                self.voted_hashes = set(data.get("voted_hashes", []))
        else:
            genesis = self.create_genesis_block()
            self.chain = [genesis]
            self.voted_hashes = set()
            self.save()
