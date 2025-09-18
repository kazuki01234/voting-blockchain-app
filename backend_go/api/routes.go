package api

import "github.com/gin-gonic/gin"

func RegisterRoutes(r *gin.Engine) {
	r.POST("/vote", VoteHandler)
	r.GET("/chain", ChainHandler)
	r.GET("/chain/results", ResultsHandler)
}
