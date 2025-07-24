import time
from .block import Block

class Blockchain:
    def __init__(self):
        self.chain = [self.create_genesis_block()]

    def create_genesis_block(self):
        return Block(0, '0', time.time(), votes=[])

    def get_latest_block(self):
        return self.chain[-1]

    def add_block(self, votes):
        prev = self.get_latest_block()
        new_block = Block(prev.index + 1, prev.hash, time.time(), votes)
        self.chain.append(new_block)

    def is_valid_chain(self):
        for i in range(1, len(self.chain)):
            current = self.chain[i]
            prev = self.chain[i - 1]
            if current.hash != current.calculate_hash():
                return False
            if current.previous_hash != prev.hash:
                return False
        return True