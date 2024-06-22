package controller

import (
	"encoding/json"
	"log"
	"net/http"
	"reflect"
	"strconv"

	"github.com/gin-gonic/gin"
	dsl "github.com/survek/LDP-Hands-On-Projects/text-classification-dsl/classify-rule-dsl"
	"github.com/survek/LDP-Hands-On-Projects/text-classification-dsl/config"
	"github.com/survek/LDP-Hands-On-Projects/text-classification-dsl/models"
)

// logic controller for rule endpoints

// Get rule text and rule name from request
var requestBody struct {
	RuleName string `json:"rule_name" binding:"required"`
	RuleText string `json:"rule_text" binding:"required"`
}

// CreateRuleHandler function
/* json body
{
	"rule_name": "count l equals 3",
	"rule_text": "count('l') == 3"
}
*/
func CreateRuleHandler(c *gin.Context) {
	log.Println("CreateRuleHandler")
	// get user id from context
	userId, ok := c.Get("userId")
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "user id not found in context"})
		return
	}
	log.Println("User id & type :", userId, reflect.TypeOf(userId))
	// get rule text and rule name from request
	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "type": "json body"})
		return
	}

	// check rule text is valid rule or not using lexer and parser
	ast, err := validAndParseRuleText(requestBody.RuleText)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "type": "rule text"})
		return
	}

	// convert ast to json $$$$$$$$$$$
	ruleJson, err := json.Marshal(ast)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Println("Rule json: ", string(ruleJson))

	// Create rule struct
	// convert userid string to uint
	user_id, err := strconv.ParseUint(userId.(string), 10, 32)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	rule := models.Rule{
		Name:     requestBody.RuleName,
		RuleText: requestBody.RuleText,
		RuleJson: ruleJson,
		UserID:   uint(user_id),
	}

	// log.Println("Rule: ", rule)

	// Save rule to db
	result := config.DB.Create(&rule)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	// return success response
	c.JSON(http.StatusCreated, gin.H{
		"userId": rule.UserID,
		"ruleId": rule.ID,
		"name":   rule.Name,
		"rule":   rule.RuleText,
	})

}

// ListRulesHandler function
func ListRulesHandler(c *gin.Context) {
	// get user id from context
	// get all rules for user from db
	// return rules list

}

// GetRuleHandler function
func GetRuleHandler(c *gin.Context) {
	// get user id from context
	// get rule id from request
	// get rule from db
	// return rule

}

// UpdateRuleHandler function - uses request body struct
func UpdateRuleHandler(c *gin.Context) {
	// get user id from context
	// get rule id from request
	// get rule text from request
	// get rule name from request
	// update rule in db
	// return success response

}

// DeleteRuleHandler function
func DeleteRuleHandler(c *gin.Context) {
	// get user id from context
	// get rule id from request
	// delete rule from db
	// return success response

}

// ---------------------
// Rule lexing and parsing logic
func validAndParseRuleText(ruleText string) (*dsl.ASTNode, error) {
	// lexing and parsing logic here
	tokens, err := dsl.Lex(ruleText) // return tokens and error
	if err != nil {
		log.Println("Error in lexing rule text")
		return nil, err
	}
	parser := dsl.NewParser(tokens)
	ast, err := parser.Parse()
	if err != nil {
		log.Println("Error in parsing rule text")
		return nil, err
	}
	// return ast node and error
	return ast, nil
}
