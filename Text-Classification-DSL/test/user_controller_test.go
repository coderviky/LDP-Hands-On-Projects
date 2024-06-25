package test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/survek/LDP-Hands-On-Projects/text-classification-dsl/controller"
	"github.com/survek/LDP-Hands-On-Projects/text-classification-dsl/models"
	"github.com/survek/LDP-Hands-On-Projects/text-classification-dsl/router"
)

// test create user
func TestUserRegisterHandler(t *testing.T) {
	// setup db connection
	// setupTestDB()
	// defer teardownTestDB()

	// setup gin server
	router := router.SetupRouter()

	w := httptest.NewRecorder()

	// send post request to create user
	user := models.User{
		Name:     "test user",
		Email:    "test@test.com",
		Password: "password",
	}
	jsonValue, _ := json.Marshal(user)
	req, _ := http.NewRequest("POST", "/api/user/register", bytes.NewBuffer(jsonValue))

	router.ServeHTTP(w, req)

	// check response status code
	assert.Equal(t, http.StatusCreated, w.Code)
	var response map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &response)
	assert.NotNil(t, response["userId"])

}

func TestUserLoginHandler(t *testing.T) {

	// setup gin server
	router := router.SetupRouter()

	// send post request to login user --------------
	// Perform login
	loginUser := controller.LoginRequest{
		Email:    "test@test.com",
		Password: "password",
	}
	loginJSON, _ := json.Marshal(loginUser)

	w := httptest.NewRecorder()
	loginReqBody := bytes.NewBuffer(loginJSON)
	req, _ := http.NewRequest("POST", "/api/user/login", loginReqBody)
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	// Assert login response
	assert.Equal(t, http.StatusOK, w.Code)

	var response map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &response)
	assert.NotNil(t, response["token"])

}
