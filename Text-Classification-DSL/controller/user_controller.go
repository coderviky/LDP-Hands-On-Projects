package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/survek/LDP-Hands-On-Projects/text-classification-dsl/config"
	"github.com/survek/LDP-Hands-On-Projects/text-classification-dsl/models"
)

// logic controller for user endpoints

func RegisterUserHandler(c *gin.Context) {
	// get json data from request
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		// error occured -> return error response
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// create hashed password
	if err := user.HashedPassword(user.Password); err != nil {
		// return error response
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	// save user to db
	record := config.DB.Create(&user)
	if record.Error != nil {
		// return error response
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": record.Error.Error(),
		})
		return
	}

	// all good -> return success response
	c.JSON(http.StatusCreated, gin.H{
		"userId": user.ID,
		"name":   user.Name,
		"email":  user.Email,
	})

}

// login request body
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// LoginUserHandler function
func LoginUserHandler(c *gin.Context) {
	// get email and password from request
	var loginRequest LoginRequest
	if err := c.ShouldBindJSON(&loginRequest); err != nil {
		// return error response
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	var user models.User

	// check user exists with email
	record := config.DB.Where("email = ?", loginRequest.Email).First(&user)

	if record.Error != nil {
		// return error response
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": record.Error.Error(),
		})
		return
	}

	// check user password
	if err := user.VerifyPassword(loginRequest.Password); err != nil {
		// return error response
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid password",
		})
		return
	}

	// create jwt token for user
	token, err := config.GenerateJWTtoken(user.ID, user.Email)
	if err != nil {
		// return error response
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	// all good -> return success response
	// c.JSON(http.StatusOK, gin.H{
	// 	"userId": user.ID,
	// 	"name":   user.Name,
	// 	"email":  user.Email,
	// 	"token":  token,
	// })
	// c.JSON(http.StatusOK, token)
	c.JSON(http.StatusOK, gin.H{
		"token": token,
	})

}
