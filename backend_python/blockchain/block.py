import hashlib
import json

class Block:
    def __init__(self, index, previous_hash, timestamp, votes, nonce=0):
        self.index = index
        self.previous_hash = previous_hash
        self.timestamp = timestamp
        self.votes = votes
        self.nonce = nonce
        self.hash = self.calculate_hash()

    def calculate_hash(self):
        block_string = json.dumps({
            'index': self.index,
            'previous_hash': self.previous_hash,
            'timestamp': self.timestamp,
            'votes': self.votes,
            'nonce': self.nonce
        }, sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()
    
    def to_dict(self):
        return {
            'index': self.index,
            'previous_hash': self.previous_hash,
            'timestamp': self.timestamp,
            'votes': self.votes,
            'nonce': self.nonce,
            'hash': self.hash
        }
        
    @classmethod
    def from_dict(cls, data):
        block = cls(
            index=data['index'],
            previous_hash=data['previous_hash'],
            timestamp=data['timestamp'],
            votes=data['votes'],
            nonce=data.get('nonce', 0)
        )
        block.hash = data.get('hash', block.calculate_hash())
        return block