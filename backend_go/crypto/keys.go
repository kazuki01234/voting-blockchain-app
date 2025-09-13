package crypto

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"

	"github.com/btcsuite/btcd/btcec/v2"
	"github.com/btcsuite/btcd/btcec/v2/ecdsa"
)

// VerifyVote secp256k1 で署名を検証する
func VerifyVote(pubKeyHex, voteData, sigHex string) bool {
	// 公開鍵をデコード
	pubKeyBytes, err := hex.DecodeString(pubKeyHex)
	if err != nil {
		fmt.Println("Failed to decode pubKey:", err)
		return false
	}

	pubKey, err := btcec.ParsePubKey(pubKeyBytes)
	if err != nil {
		fmt.Println("Failed to parse pubKey:", err)
		return false
	}

	// DER形式署名をデコード
	sigBytes, err := hex.DecodeString(sigHex)
	if err != nil {
		fmt.Println("Failed to decode signature:", err)
		return false
	}

	sig, err := ecdsa.ParseDERSignature(sigBytes)
	if err != nil {
		fmt.Println("Failed to parse DER signature:", err)
		return false
	}

	// voteData をハッシュ
	hash := sha256.Sum256([]byte(voteData))

	// 署名検証
	return sig.Verify(hash[:], pubKey)
}
