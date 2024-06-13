package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// text classification controller
func ClassifyTextHandler(c *gin.Context) {
	// get user id and email from context
	userId, _ := c.Get("userId")
	email, _ := c.Get("email")
	c.JSON(http.StatusOK, gin.H{
		"message": "Text classification handler",
		"userId":  userId,
		"email":   email,
	})
}
