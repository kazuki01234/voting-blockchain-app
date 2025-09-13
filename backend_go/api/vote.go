package api

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kazuki01234/voting_blockchain_project/backend_go/blockchain"
	"github.com/kazuki01234/voting_blockchain_project/backend_go/crypto"
)

type VoteRequest struct {
	VoterPublicKey string `json:"voter_public_key"`
	VoteData       string `json:"vote_data"`
	Signature      string `json:"signature"`
}

func VoteHandler(c *gin.Context) {
	fmt.Println("VoteHandler triggered. Method:", c.Request.Method)

	defer func() {
        if r := recover(); r != nil {
            fmt.Println("Recovered from panic:", r)
            c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
        }
    }()

	var req VoteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		fmt.Println("JSON bind error:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// デバッグ出力
	fmt.Println("Received vote:", req)

	fmt.Println("Step: verifying signature")
	if !crypto.VerifyVote(req.VoterPublicKey, req.VoteData, req.Signature) {
		fmt.Println("Signature invalid")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid signature"})
		return
	}
	fmt.Println("Signature valid")

	fmt.Println("Step: checking if already voted")
	if blockchain.BlockchainInstance.HasVoted(req.VoterPublicKey) {
		fmt.Println("Already voted")
		c.JSON(http.StatusBadRequest, gin.H{"error": "This public key has already voted"})
		return
	}
	fmt.Println("Has not voted yet")

	fmt.Println("Step: adding block")
	tx := blockchain.Transaction{
		Voter:     req.VoterPublicKey,
		Vote:      req.VoteData,
		Signature: req.Signature,
	}

	_, err := blockchain.BlockchainInstance.AddBlock([]blockchain.Transaction{tx})
	if err != nil {
		fmt.Println("AddBlock error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	fmt.Println("Vote added successfully")
	c.JSON(http.StatusOK, gin.H{"message": "Vote added to blockchain"})
}
	
