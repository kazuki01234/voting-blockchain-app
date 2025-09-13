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

// Transaction は1つの投票を表す
type Transaction struct {
	Voter     string `json:"voter"`
	Vote      string `json:"vote"`
	Signature string `json:"signature"`
}

// Block はブロックを表す
type Block struct {
	Index        int           `json:"index"`
	PreviousHash string        `json:"previous_hash"`
	Timestamp    int64         `json:"timestamp"`
	Votes        []Transaction `json:"votes"`
	Nonce        int           `json:"nonce"`
	Hash         string        `json:"hash"`
}

// Blockchain はブロックチェーンを表す
type Blockchain struct {
	Chain           []Block
	VotedPublicKeys map[string]struct{}
	mu              sync.Mutex
}

const DataFile = "data/blockchain.json"

// グローバルインスタンス
var BlockchainInstance = NewBlockchain()

// NewBlockchain はブロックチェーンを初期化する
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

// createGenesisBlock は最初のブロックを作成
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

// calculateHash はブロックのハッシュを計算
func (b *Block) calculateHash() string {
	voteBytes, _ := json.Marshal(b.Votes)
    record := fmt.Sprintf("%d%s%d%s%d", b.Index, b.PreviousHash, b.Timestamp, voteBytes, b.Nonce)
    sum := sha256.Sum256([]byte(record))
	return hex.EncodeToString(sum[:])
}

// GetLatestBlock は最新ブロックを返す
func (bc *Blockchain) GetLatestBlock() Block {
	bc.mu.Lock()
	defer bc.mu.Unlock()
	return bc.Chain[len(bc.Chain)-1]
}

// AddBlock はブロックを追加
func (bc *Blockchain) AddBlock(votes []Transaction) (Block, error) {
    bc.mu.Lock()
    defer bc.mu.Unlock()

    fmt.Println("[DEBUG] AddBlock called with votes:", votes)

    // 既に投票済みチェック
    for _, v := range votes {
        if _, ok := bc.VotedPublicKeys[v.Voter]; ok {
            fmt.Println("[DEBUG] Voter already exists:", v.Voter)
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

    fmt.Println("[DEBUG] New block created:", newBlock)

    // 非同期で保存
    go func() {
        fmt.Println("[DEBUG] Save goroutine started")
        if err := bc.Save(); err != nil {
            fmt.Println("Failed to save blockchain:", err)
        } else {
            fmt.Println("[DEBUG] Blockchain saved successfully")
        }
    }()

    return newBlock, nil
}

// HasVoted は既に投票済みか確認
func (bc *Blockchain) HasVoted(pubKey string) bool {
	bc.mu.Lock()
	defer bc.mu.Unlock()
	_, ok := bc.VotedPublicKeys[pubKey]
	return ok
}

// GetResults は投票結果を集計
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

// GetChain はチェーン全体を返す
func (bc *Blockchain) GetChain() []Block {
	bc.mu.Lock()
	defer bc.mu.Unlock()
	return bc.Chain
}

// Save はブロックチェーンをファイルに保存
func (bc *Blockchain) Save() error {
    bc.mu.Lock()
    defer bc.mu.Unlock()

    fmt.Println("[DEBUG] Save() called")

    os.MkdirAll("data", os.ModePerm)
    file, err := os.Create(DataFile)
    if err != nil {
        fmt.Println("[DEBUG] os.Create error:", err)
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
    if err != nil {
        fmt.Println("[DEBUG] json.Encode error:", err)
    } else {
        fmt.Println("[DEBUG] json.Encode success, written to", DataFile)
    }
    return err
}

// Load はブロックチェーンをファイルから読み込み
func (bc *Blockchain) Load() error {
	bc.mu.Lock()
	defer bc.mu.Unlock()

	file, err := os.Open(DataFile)
	if err != nil {
		return nil // ファイルがなければGenesisでOK
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
