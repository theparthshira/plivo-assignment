package pkg

import (
	"crypto/rand"
	"fmt"
	"math/big"
)

const (
	lowercase = "abcdefghijklmnopqrstuvwxyz"
	uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	digits    = "0123456789"
	symbols   = "!@#$%^&*()_+-=[]{}|;:,.<>?"
)

func GeneratePassword() (string, error) {
	var charset string

	charset += lowercase
	charset += uppercase
	charset += digits
	charset += symbols

	if len(charset) == 0 {
		return "", fmt.Errorf("at least one character type must be enabled")
	}

	// Generate password
	password := make([]byte, 12)
	charsetLen := big.NewInt(int64(len(charset)))

	for i := range password {
		randomIndex, err := rand.Int(rand.Reader, charsetLen)
		if err != nil {
			return "", fmt.Errorf("failed to generate random number: %v", err)
		}
		password[i] = charset[randomIndex.Int64()]
	}

	return string(password), nil
}
