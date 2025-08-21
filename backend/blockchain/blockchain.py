import time, json, os
from .block import Block

class Blockchain:
    def __init__(self, path='data/blockchain.json'):
        self.path = path
        os.makedirs(os.path.dirname(path), exist_ok=True)
        if os.path.exists(self.path):
            self.chain = self.load()
        else:
            self.chain = [self.create_genesis_block()]

    def create_genesis_block(self):
        return Block(0, '0', time.time(), votes=[])

    def get_latest_block(self):
        return self.chain[-1]

    def add_block(self, votes):
        prev = self.get_latest_block()
        new_block = Block(prev.index + 1, prev.hash, time.time(), votes)
        self.chain.append(new_block)
        self.save()

    def is_valid_chain(self):
        for i in range(1, len(self.chain)):
            current = self.chain[i]
            prev = self.chain[i - 1]
            if current.hash != current.calculate_hash():
                return False
            if current.previous_hash != prev.hash:
                return False
        return True
    
    def save(self, path='data/blockchain.json'):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w') as f:
            json.dump([block.to_dict() for block in self.chain], f, indent=2)
            
    def load(self, path='data/blockchain.json'):
        if os.path.exists(path):
            with open(path) as f:
                data = json.load(f)
                return [Block.from_dict(block_data) for block_data in data]
        else:
            return [self.create_genesis_block()]