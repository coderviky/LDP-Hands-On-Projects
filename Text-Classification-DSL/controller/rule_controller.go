package controller

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	dsl "github.com/survek/LDP-Hands-On-Projects/text-classification-dsl/classify-rule-dsl"
	"github.com/survek/LDP-Hands-On-Projects/text-classification-dsl/config"
	"github.com/survek/LDP-Hands-On-Projects/text-classification-dsl/models"
)

// logic controller for rule endpoints

// Get rule text and rule name from request
type RuleRequestBody struct {
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
	// log.Println("CreateRuleHandler")
	// get user id from context
	userId, ok := c.Get("userId")
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "user id not found in context"})
		return
	}
	// log.Println("User id & type :", userId, reflect.TypeOf(userId))
	// convert userid string to uint
	user_id, err := strconv.ParseUint(userId.(string), 10, 32)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	requestBody := RuleRequestBody{}
	// get rule text and rule name from request
	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "type": "json body"})
		return
	}

	// check rule text is valid rule or not using lexer and parser
	ast, err := validAndParseRuleText(requestBody.RuleText)
	if err != nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"error": err.Error(), "type": "rule text"})
		return
	}

	// convert ast to json $$$$$$$$$$$
	ruleJson, err := json.Marshal(ast)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// log.Println("Rule json: ", string(ruleJson))

	// Create rule struct
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
		"userId":    rule.UserID,
		"ruleId":    rule.ID,
		"rule_name": rule.Name,
		"rule_text": rule.RuleText,
	})

}

// ListRulesHandler function
func ListRulesHandler(c *gin.Context) {
	// get user id from context
	// get user id from context
	userId, ok := c.Get("userId")
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "user id not found in context"})
		return
	}
	// convert userid string to uint
	user_id, err := strconv.ParseUint(userId.(string), 10, 32)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// get all rules for user from db
	var rules []models.Rule
	result := config.DB.Where("user_id = ?", user_id).Find(&rules)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	// return rules list
	c.JSON(http.StatusOK, gin.H{
		"userId": user_id,
		"rules":  rules,
	})

}

// GetRuleHandler function
func GetRuleHandler(c *gin.Context) {
	// get user id from context
	userId, ok := c.Get("userId")
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "user id not found in context"})
		return
	}
	// convert userid string to uint
	user_id, err := strconv.ParseUint(userId.(string), 10, 32)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// get rule id from request
	ruleID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	// log.Println("Rule id: ", c.Param("id"))
	// log.Println("Rule id: ", ruleID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// get rule from db
	var rule models.Rule
	result := config.DB.Where("user_id = ? AND id = ?", user_id, ruleID).First(&rule)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	// return rule
	c.JSON(http.StatusOK, gin.H{
		"userId":    user_id,
		"ruleId":    rule.ID,
		"rule_name": rule.Name,
		"rule_text": rule.RuleText,
	})

}

// UpdateRuleHandler function - uses request body struct
func UpdateRuleHandler(c *gin.Context) {
	// get user id from context
	userId, ok := c.Get("userId")
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "user id not found in context"})
		return
	}
	// convert userid string to uint
	user_id, err := strconv.ParseUint(userId.(string), 10, 32)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// get rule id from request
	ruleID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// get rule text and name from request
	requestBody := RuleRequestBody{}
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

	// Create rule struct
	rule := models.Rule{
		Name:     requestBody.RuleName,
		RuleText: requestBody.RuleText,
		RuleJson: ruleJson,
		UserID:   uint(user_id),
	}

	// update rule in db
	result := config.DB.Model(&rule).Where("user_id = ? AND id = ?", user_id, ruleID).Updates(&rule)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	// return success response
	c.JSON(http.StatusOK, gin.H{
		"message":   "Rule updated successfully",
		"userId":    user_id,
		"ruleId":    ruleID,
		"rule_name": rule.Name,
		"rule_text": rule.RuleText,
	})

}

// DeleteRuleHandler function
func DeleteRuleHandler(c *gin.Context) {
	// get user id from context
	userId, ok := c.Get("userId")
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "user id not found in context"})
		return
	}
	// convert userid string to uint
	user_id, err := strconv.ParseUint(userId.(string), 10, 32)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// get rule id from request
	ruleID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// delete rule from db
	result := config.DB.Where("user_id = ? AND id = ?", user_id, ruleID).Delete(&models.Rule{})
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	// return success response
	c.JSON(http.StatusOK, gin.H{
		"message": "Rule deleted successfully",
		"userId":  user_id,
		"ruleId":  ruleID,
	})

}

//

//

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
