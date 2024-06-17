package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/survek/LDP-Hands-On-Projects/text-classification-dsl/config"
)

// auth middleware to check jwt token and inject user info in context
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// get token from request header
		tokenString := c.GetHeader("Authorization")
		// separate token from 'Bearer'
		tokenString = strings.Split(tokenString, " ")[1]
		if tokenString == "" {
			// return error response
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Authorization token not found",
			})
			c.Abort()
			return
		}

		// verify jwt token
		claims, err := config.VerifyJWTtoken(tokenString)
		if err != nil {
			// return error response
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": err.Error(),
			})
			c.Abort()
			return
		}

		// inject user info in context
		c.Set("userId", claims.UserId)
		c.Set("email", claims.Email)

		c.Next()
	}
}
