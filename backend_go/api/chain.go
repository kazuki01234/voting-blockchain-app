package api

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/kazuki01234/voting_blockchain_project/backend_go/blockchain"
)

func ChainHandler(c *gin.Context) {
	chain := blockchain.BlockchainInstance.GetChain()
	c.JSON(http.StatusOK, chain)
}

func ResultsHandler(c *gin.Context) {
	results := blockchain.BlockchainInstance.GetResults()
	c.JSON(http.StatusOK, results)
}