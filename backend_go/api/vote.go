package api

import (
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
	defer func() {
        if r := recover(); r != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
        }
    }()

	var req VoteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if !crypto.VerifyVote(req.VoterPublicKey, req.VoteData, req.Signature) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid signature"})
		return
	}

	if blockchain.BlockchainInstance.HasVoted(req.VoterPublicKey) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "This public key has already voted"})
		return
	}

	tx := blockchain.Transaction{
		Voter:     req.VoterPublicKey,
		Vote:      req.VoteData,
		Signature: req.Signature,
	}

	_, err := blockchain.BlockchainInstance.AddBlock([]blockchain.Transaction{tx})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Vote added to blockchain"})
}
	
