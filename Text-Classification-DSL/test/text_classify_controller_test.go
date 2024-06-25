package test

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/survek/LDP-Hands-On-Projects/text-classification-dsl/controller"
	"github.com/survek/LDP-Hands-On-Projects/text-classification-dsl/models"
	"github.com/survek/LDP-Hands-On-Projects/text-classification-dsl/router"
)

func TestTextClassifyController(t *testing.T) {

	router := router.SetupRouter()
	// ----------------------

	token := getUserClassifyTextToken(router)
	require.NotEmpty(t, token, "Error in getting token")

	// Create 5 rules
	rules := []controller.RuleRequestBody{
		{RuleName: "Rule 1", RuleText: "count('a') + max(count('b'), 2) >= 2"},
		{RuleName: "Rule 2", RuleText: "count('e') + min(3,6) <= 10"},
		{RuleName: "Rule 3", RuleText: "count('i') * 3 + 4 / 2 - 1 == 6"},
		{RuleName: "Rule 4", RuleText: "count('o') == 0"},
		{RuleName: "Rule 5", RuleText: "count('u') / 2 >= 1"},
	}

	for _, rule := range rules {
		jsonValue, _ := json.Marshal(rule)

		req, _ := http.NewRequest("POST", "/api/rule/create", bytes.NewBuffer(jsonValue))
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", "Bearer "+token)

		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusCreated, w.Code, "Expected status code 201")
	}
	// all rules created successfully

	srv := httptest.NewServer(router)
	defer srv.Close()

	// Set up WebSocket connection
	wsURL := "ws" + srv.URL[4:] + "/api/text/classify"
	header := http.Header{}
	header.Set("Authorization", "Bearer "+token)
	conn, _, err := websocket.DefaultDialer.Dial(wsURL, header)
	require.NoError(t, err, "Failed to open websocket connection")
	defer conn.Close()

	// Test 10 text strings
	texts := []string{
		"banana",
		"apple",
		"kiwi",
		"orange",
		"umbrella",
		"grape",
		"peach",
		"plum",
		"melon",
		"berry",
	}

	// Define expected responses for each text message
	expectedResponses := [][]string{
		{"Rule 1 : true", "Rule 2 : true", "Rule 3 : false", "Rule 4 : true", "Rule 5 : false"},
		{"Rule 1 : true", "Rule 2 : true", "Rule 3 : false", "Rule 4 : true", "Rule 5 : false"},
		{"Rule 1 : true", "Rule 2 : true", "Rule 3 : false", "Rule 4 : true", "Rule 5 : false"},
		{"Rule 1 : true", "Rule 2 : true", "Rule 3 : false", "Rule 4 : false", "Rule 5 : false"},
		{"Rule 1 : true", "Rule 2 : true", "Rule 3 : false", "Rule 4 : true", "Rule 5 : false"},
		{"Rule 1 : true", "Rule 2 : true", "Rule 3 : false", "Rule 4 : true", "Rule 5 : false"},
		{"Rule 1 : true", "Rule 2 : true", "Rule 3 : false", "Rule 4 : true", "Rule 5 : false"},
		{"Rule 1 : true", "Rule 2 : true", "Rule 3 : false", "Rule 4 : true", "Rule 5 : false"},
		{"Rule 1 : true", "Rule 2 : true", "Rule 3 : false", "Rule 4 : false", "Rule 5 : false"},
		{"Rule 1 : true", "Rule 2 : true", "Rule 3 : false", "Rule 4 : true", "Rule 5 : false"},
	}

	for ind, text := range texts {
		err = conn.WriteMessage(websocket.TextMessage, []byte(text))
		require.NoError(t, err, "Failed to send message")

		log.Println(text)

		expResponse := expectedResponses[ind]

		i := 0

		for {
			messageType, message, err := conn.ReadMessage()
			require.NoError(t, err, "Failed to read message")
			// log.Println(string(message))

			if messageType == websocket.BinaryMessage {
				if message[0] == 0 {
					break
				}
			}
			if messageType == websocket.TextMessage {
				log.Printf("  %s\n", string(message))

				// assert response
				assert.Equal(t, expResponse[i], string(message))
				i++
			}
		}
	}

}

// getUserLoginToken function for classify controller test
func getUserClassifyTextToken(router *gin.Engine) string {
	// create user
	w := httptest.NewRecorder()
	user := models.User{
		Name:     "text classify test user",
		Email:    "classifytest@test.com",
		Password: "password",
	}
	jsonValue, _ := json.Marshal(user)
	req, _ := http.NewRequest("POST", "/api/user/register", bytes.NewBuffer(jsonValue))
	router.ServeHTTP(w, req)

	// check response status code
	if w.Code != http.StatusCreated && w.Code != http.StatusConflict {
		return ""
	}

	loginUser := controller.LoginRequest{
		Email:    "classifytest@test.com",
		Password: "password",
	}
	loginJSON, _ := json.Marshal(loginUser)

	w = httptest.NewRecorder()
	loginReqBody := bytes.NewBuffer(loginJSON)
	req, _ = http.NewRequest("POST", "/api/user/login", loginReqBody)
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	// check response status code
	if w.Code != http.StatusOK {
		return ""
	}

	var response map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &response)
	token, ok := response["token"].(string)
	if !ok {
		return ""
	}
	return token
}
