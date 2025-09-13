package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/kazuki01234/voting_blockchain_project/backend_go/api"
)

func main() {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
	}))

	// ルートパス
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Blockchain-based Voting System API (Go)"})
	})

	// APIルート登録
	api.RegisterRoutes(r)

	r.Run("0.0.0.0:5001")
}
