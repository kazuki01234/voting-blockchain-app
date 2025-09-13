package api

import "github.com/gin-gonic/gin"

// VoteHandler, ChainHandler, ResultsHandler は既存のハンドラを使用

func RegisterRoutes(r *gin.Engine) {
	// --- 投票用ルート ---
	// 単純に POST /vote だけを登録
	r.POST("/vote", VoteHandler)

	// --- ブロックチェーン関連ルート ---
	r.GET("/chain", ChainHandler)
	r.GET("/chain/results", ResultsHandler)
}
