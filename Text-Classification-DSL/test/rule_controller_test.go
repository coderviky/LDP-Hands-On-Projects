package test

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/survek/LDP-Hands-On-Projects/text-classification-dsl/controller"
	"github.com/survek/LDP-Hands-On-Projects/text-classification-dsl/models"
	"github.com/survek/LDP-Hands-On-Projects/text-classification-dsl/router"
)

// rule CRUD test cases
func TestRuleCreateController(t *testing.T) {
	// setup - in testmain function

	// setup gin server
	router := router.SetupRouter()
	// ----------------------

	// get token by registering user and login
	token := getUserLoginToken(router)
	if token == "" {
		t.Error("Error in getting token")
		return
	}

	log.Println("Token: ", token)

	// send post request to create rule
	rule := controller.RuleRequestBody{
		RuleName: "count l and max 8 minus 4 by 2 equals 9",
		// hello world
		RuleText: "count('l') + max(4,3) * 2 - 4 / 2 == 9",
	}

	// convert rule struct to json
	jsonValue, _ := json.Marshal(rule)

	// add token to request header
	req, _ := http.NewRequest("POST", "/api/rule/create", bytes.NewBuffer(jsonValue))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// check response status code
	assert.Equal(t, http.StatusCreated, w.Code)

	var response map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &response)
	assert.NotNil(t, response["ruleId"])

	// fmt.Println("Response: ", response["rule_name"])
	assert.Equal(t, rule.RuleName, response["rule_name"])
	assert.Equal(t, rule.RuleText, response["rule_text"])

}

func TestRuleCreateControllerWithInvalidData(t *testing.T) {
	// setup gin server
	router := router.SetupRouter()
	// ----------------------

	// get token by registering user and login
	token := getUserLoginToken(router)
	if token == "" {
		t.Error("Error in getting token")
		return
	}

	log.Println("Token: ", token)

	// send post request to create rule with ivalid rule text
	rule := controller.RuleRequestBody{
		RuleName: "count l plus max(3,4) equals 9",
		// hello world
		RuleText: "count('aa') + max  == 9",
	}

	// convert rule struct to json
	jsonValue, _ := json.Marshal(rule)

	// add token to request header
	req, _ := http.NewRequest("POST", "/api/rule/create", bytes.NewBuffer(jsonValue))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// response
	/*  http.StatusNotAcceptable
		{
	  "error": "expected '(', found: ==",
	  "type": "rule text"
	}
	*/

	// check response status code
	assert.Equal(t, http.StatusNotAcceptable, w.Code)

	var response map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &response)
	assert.NotNil(t, response["error"])
	assert.Equal(t, "expected '(', found: ==", response["error"])
	assert.Equal(t, "rule text", response["type"])

}

func TestRuleGetController(t *testing.T) {
	// setup gin server
	router := router.SetupRouter()
	// ----------------------

	// get token by registering user and login
	token := getUserLoginToken(router)
	if token == "" {
		t.Error("Error in getting token")
		return
	}

	// log.Println("Token: ", token)

	// send post request to create rule
	rule := controller.RuleRequestBody{
		RuleName: "count o equals 2",
		RuleText: "count('o') == 2",
	}

	// convert rule struct to json
	jsonValue, _ := json.Marshal(rule)

	// add token to request header
	req, _ := http.NewRequest("POST", "/api/rule/create", bytes.NewBuffer(jsonValue))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// check response status code
	assert.Equal(t, http.StatusCreated, w.Code)

	var response map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &response)
	assert.NotNil(t, response["ruleId"])

	// ------###
	// check ruleid type and value
	// log.Println("rule id type : " + reflect.TypeOf(response["ruleId"]).String())
	ruleId := strconv.FormatFloat(response["ruleId"].(float64), 'f', -1, 64)
	// log.Println("Rule id (test): ", ruleId)
	// send get request to get rule
	w = httptest.NewRecorder()
	req, _ = http.NewRequest("GET", "/api/rule/"+ruleId, nil)
	req.Header.Set("Authorization", "Bearer "+token)

	router.ServeHTTP(w, req)

	// check response status code
	assert.Equal(t, http.StatusOK, w.Code)

	var getResponse map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &getResponse)
	assert.NotNil(t, getResponse["ruleId"])
	assert.Equal(t, rule.RuleName, getResponse["rule_name"])
	assert.Equal(t, rule.RuleText, getResponse["rule_text"])

}

func TestRuleUpdateController(t *testing.T) {
	// setup gin server
	router := router.SetupRouter()
	// ----------------------

	// get token by registering user and login
	token := getUserLoginToken(router)
	if token == "" {
		t.Error("Error in getting token")
		return
	}

	log.Println("Token: ", token)

	// send post request to create rule
	rule := controller.RuleRequestBody{
		RuleName: "count l equals 3",
		RuleText: "count('l') == 3",
	}

	// convert rule struct to json
	jsonValue, _ := json.Marshal(rule)

	// add token to request header
	req, _ := http.NewRequest("POST", "/api/rule/create", bytes.NewBuffer(jsonValue))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// check response status code
	assert.Equal(t, http.StatusCreated, w.Code)

	var response map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &response)
	assert.NotNil(t, response["ruleId"])

	// ------###
	ruleId := strconv.FormatFloat(response["ruleId"].(float64), 'f', -1, 64)
	// log.Println("Rule id (test): ", ruleId)

	// update rule and send put request
	rule.RuleName = "count l equals 4"
	rule.RuleText = "count('l') == 4"
	jsonValue, _ = json.Marshal(rule)

	w = httptest.NewRecorder()
	req, _ = http.NewRequest("PUT", "/api/rule/"+ruleId, bytes.NewBuffer(jsonValue))
	req.Header.Set("Authorization", "Bearer "+token)

	router.ServeHTTP(w, req)

	// check response status code
	assert.Equal(t, http.StatusOK, w.Code)

	var getResponse map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &getResponse)
	assert.NotNil(t, getResponse["ruleId"])
	assert.Equal(t, rule.RuleName, getResponse["rule_name"])
	assert.Equal(t, rule.RuleText, getResponse["rule_text"])

}

func TestRuleDeleteController(t *testing.T) {
	// setup gin server
	router := router.SetupRouter()
	// ----------------------

	// get token by registering user and login
	token := getUserLoginToken(router)
	if token == "" {
		t.Error("Error in getting token")
		return
	}

	log.Println("Token: ", token)

	// send post request to create rule
	rule := controller.RuleRequestBody{
		RuleName: "count abc plus max of count aa or 5 equals 4",
		RuleText: "count('abc') + max(count('aa'), 5) == 4",
	}

	// convert rule struct to json
	jsonValue, _ := json.Marshal(rule)

	// add token to request header
	req, _ := http.NewRequest("POST", "/api/rule/create", bytes.NewBuffer(jsonValue))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// check response status code
	assert.Equal(t, http.StatusCreated, w.Code)

	var response map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &response)
	assert.NotNil(t, response["ruleId"])

	// ------###
	ruleId := strconv.FormatFloat(response["ruleId"].(float64), 'f', -1, 64)
	// log.Println("Rule id (test): ", ruleId)

	// send delete request to delete rule
	w = httptest.NewRecorder()
	req, _ = http.NewRequest("DELETE", "/api/rule/"+ruleId, nil)
	req.Header.Set("Authorization", "Bearer "+token)

	router.ServeHTTP(w, req)

	// check response status code
	assert.Equal(t, http.StatusOK, w.Code)

	var getResponse map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &getResponse)
	assert.NotNil(t, getResponse["ruleId"])
	assert.Equal(t, "Rule deleted successfully", getResponse["message"])

}

// login User and get token
func getUserLoginToken(router *gin.Engine) string {
	// // setup gin server
	// router := router.SetupRouter()

	// create user
	w := httptest.NewRecorder()
	user := models.User{
		Name:     "rule test user",
		Email:    "ruletest@test.com",
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
		Email:    "ruletest@test.com",
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
