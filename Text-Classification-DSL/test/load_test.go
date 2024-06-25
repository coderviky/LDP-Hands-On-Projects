package test

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/survek/LDP-Hands-On-Projects/text-classification-dsl/controller"
	"github.com/survek/LDP-Hands-On-Projects/text-classification-dsl/router"
	vegeta "github.com/tsenart/vegeta/lib"
)

func TestRuleGetControllerLoadTest(t *testing.T) {

	router := router.SetupRouter()

	srv := httptest.NewServer(router)
	defer srv.Close()

	token := getUserLoginToken(router)
	if token == "" {
		t.Error("Error in getting token")
		return
	}

	// Create a rule first
	rule := controller.RuleRequestBody{
		RuleName: "count aa plus count bb greater than 2",
		RuleText: "count('aa') + count('bb') > 2",
	}
	jsonValue, _ := json.Marshal(rule)

	req, _ := http.NewRequest("POST", srv.URL+"/api/rule/create", bytes.NewBuffer(jsonValue))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)

	var response map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &response)
	ruleId := strconv.FormatFloat(response["ruleId"].(float64), 'f', -1, 64)

	// Vegeta load testing %%%%%%%%%%%%%%%%%%%%%%%%%%%%%
	rate := vegeta.Rate{Freq: 100, Per: time.Second} // 1000 requests per second
	duration := 5 * time.Second                      // Test duration
	targeter := vegeta.NewStaticTargeter(vegeta.Target{
		Method: "GET",
		URL:    srv.URL + "/api/rule/" + ruleId,
		Header: http.Header{
			"Authorization": []string{"Bearer " + token},
		},
	})

	attacker := vegeta.NewAttacker()
	var metrics vegeta.Metrics

	for res := range attacker.Attack(targeter, rate, duration, "GetRuleHandler Load Test") {
		metrics.Add(res)
	}
	metrics.Close()

	log.Printf("99th percentile: %s\n", metrics.Latencies.P99)
	log.Printf("Success Rate: %f\n", metrics.Success)
	log.Printf("Requests: %d\n", metrics.Requests)

	// Assert load test results
	assert.Greater(t, metrics.Success, 0.99, "Success rate should be greater than 99%")
}
