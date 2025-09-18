package blockchain

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"os"
	"sync"
	"time"
	"fmt"
)

type Transaction struct {
	Voter     string `json:"voter"`
	Vote      string `json:"vote"`
	Signature string `json:"signature"`
}

type Block struct {
	Index        int           `json:"index"`
	PreviousHash string        `json:"previous_hash"`
	Timestamp    int64         `json:"timestamp"`
	Votes        []Transaction `json:"votes"`
	Nonce        int           `json:"nonce"`
	Hash         string        `json:"hash"`
}

type Blockchain struct {
	Chain           []Block
	VotedPublicKeys map[string]struct{}
	mu              sync.Mutex
}

const DataFile = "data/blockchain.json"

var BlockchainInstance = NewBlockchain()

func NewBlockchain() *Blockchain {
	bc := &Blockchain{
		Chain:           []Block{},
		VotedPublicKeys: make(map[string]struct{}),
	}
	bc.Load()

	if len(bc.Chain) == 0 {
		genesis := bc.createGenesisBlock()
		bc.Chain = []Block{genesis}
		bc.Save()
	}
	return bc
}

func (bc *Blockchain) createGenesisBlock() Block {
	b := Block{
		Index:        0,
		PreviousHash: "0",
		Timestamp:    time.Now().Unix(),
		Votes:        []Transaction{},
		Nonce:        0,
	}
	b.Hash = b.calculateHash()
	return b
}

func (b *Block) calculateHash() string {
	voteBytes, _ := json.Marshal(b.Votes)
    record := fmt.Sprintf("%d%s%d%s%d", b.Index, b.PreviousHash, b.Timestamp, voteBytes, b.Nonce)
    sum := sha256.Sum256([]byte(record))
	return hex.EncodeToString(sum[:])
}

func (bc *Blockchain) GetLatestBlock() Block {
	bc.mu.Lock()
	defer bc.mu.Unlock()
	return bc.Chain[len(bc.Chain)-1]
}

func (bc *Blockchain) AddBlock(votes []Transaction) (Block, error) {
    bc.mu.Lock()
    defer bc.mu.Unlock()

    for _, v := range votes {
        if _, ok := bc.VotedPublicKeys[v.Voter]; ok {
            return Block{}, errors.New("this public key has already voted")
        }
    }

    prev := bc.Chain[len(bc.Chain)-1]
    newBlock := Block{
        Index:        prev.Index + 1,
        PreviousHash: prev.Hash,
        Timestamp:    time.Now().Unix(),
        Votes:        votes,
        Nonce:        0,
    }
    newBlock.Hash = newBlock.calculateHash()

    bc.Chain = append(bc.Chain, newBlock)

    for _, v := range votes {
        bc.VotedPublicKeys[v.Voter] = struct{}{}
    }

    go func() {
		_ = bc.Save()
	}()

    return newBlock, nil
}

func (bc *Blockchain) HasVoted(pubKey string) bool {
	bc.mu.Lock()
	defer bc.mu.Unlock()
	_, ok := bc.VotedPublicKeys[pubKey]
	return ok
}

func (bc *Blockchain) GetResults() map[string]int {
	bc.mu.Lock()
	defer bc.mu.Unlock()
	results := make(map[string]int)
	for _, block := range bc.Chain {
		for _, v := range block.Votes {
			results[v.Vote]++
		}
	}
	return results
}

func (bc *Blockchain) GetChain() []Block {
	bc.mu.Lock()
	defer bc.mu.Unlock()
	return bc.Chain
}

func (bc *Blockchain) Save() error {
    bc.mu.Lock()
    defer bc.mu.Unlock()

    os.MkdirAll("data", os.ModePerm)
    file, err := os.Create(DataFile)
    if err != nil {
        return err
    }
    defer file.Close()

    data := struct {
        Chain           []Block  `json:"chain"`
        VotedPublicKeys []string `json:"voted_public_keys"`
    }{
        Chain: bc.Chain,
    }

    for k := range bc.VotedPublicKeys {
        data.VotedPublicKeys = append(data.VotedPublicKeys, k)
    }

    enc := json.NewEncoder(file)
    enc.SetIndent("", "  ")
    err = enc.Encode(data)

    return err
}

func (bc *Blockchain) Load() error {
	bc.mu.Lock()
	defer bc.mu.Unlock()

	file, err := os.Open(DataFile)
	if err != nil {
		return nil
	}
	defer file.Close()

	data := struct {
		Chain           []Block  `json:"chain"`
		VotedPublicKeys []string `json:"voted_public_keys"`
	}{}

	dec := json.NewDecoder(file)
	if err := dec.Decode(&data); err != nil {
		return err
	}

	bc.Chain = data.Chain
	bc.VotedPublicKeys = make(map[string]struct{})
	for _, k := range data.VotedPublicKeys {
		bc.VotedPublicKeys[k] = struct{}{}
	}

	return nil
}
