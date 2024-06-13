package config

import (
	"errors"
	"os"

	"github.com/golang-jwt/jwt/v5"
)

// jwt token creation and verification

// type for jwt claims
type JwtClaims struct {
	UserId uint
	Email  string
	jwt.RegisteredClaims
}

func GenerateJWTtoken(id uint, email string) (string, error) {
	// create jwt claims
	claims := JwtClaims{
		UserId:           id,
		Email:            email,
		RegisteredClaims: jwt.RegisteredClaims{}, // expired at date can be added to check validation - skip for now
	}

	// create jwt token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// sign the token
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))

}

// verify jwt token
func VerifyJWTtoken(tokenString string) (*JwtClaims, error) {
	// parse jwt token
	token, err := jwt.ParseWithClaims(tokenString, &JwtClaims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if err != nil {
		return nil, err
	}

	// check if token is valid
	claims, ok := token.Claims.(*JwtClaims)

	if !ok {
		err := errors.New("could not parse claims")
		return nil, err
	}

	return claims, nil

}
