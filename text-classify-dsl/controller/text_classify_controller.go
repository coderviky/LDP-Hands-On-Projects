package controller

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	dsl "github.com/survek/LDP-Hands-On-Projects/text-classification-dsl/classify-rule-dsl"
	"github.com/survek/LDP-Hands-On-Projects/text-classification-dsl/config"
	"github.com/survek/LDP-Hands-On-Projects/text-classification-dsl/models"
)

// struct for classification engine - ast node and rule text
type RuleInClassificationEngine struct {
	RuleText string
	ASTNode  dsl.ASTNode
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // Adjust this for production
	},
}

// text classification controller
func ClassifyTextHandler(c *gin.Context) {
	// get user id and email from context
	userId, ok := c.Get("userId")
	if !ok {
		c.JSON(500, gin.H{
			"error": "User id not found in context",
		})
		return
	}
	user_id_64, err := strconv.ParseUint(userId.(string), 10, 64)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	user_id := uint(user_id_64)

	// check user id - if required
	// get rules from db for user id
	var rules []models.Rule
	records := config.DB.Where("user_id = ?", user_id).Find(&rules)
	if records.Error != nil {
		c.JSON(500, gin.H{
			"error": records.Error.Error(),
		})
		return
	}

	// create rule classification engine $$$$$$$$$$$$
	rule_classification_engine, err := createRuleClassificationEngine(rules)
	if err != nil {
		c.JSON(500, gin.H{
			"error": "Failed to create rule classification engine",
		})
		return
	}
	// log len of rule classification engine
	log.Println("Rule Classification Engine Length: ", len(rule_classification_engine))

	// ############# upgrade the connection to a websocket connection #############
	connection, err := upgrader.Upgrade(c.Writer, c.Request, nil)

	if err != nil {
		c.JSON(400, gin.H{
			"error": "Failed to upgrade connection to websocket",
		})
		return
	}

	// defer closing the connection
	defer connection.Close()

	for {
		// read message from the connection
		messageType, p, err := connection.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}

		if messageType == websocket.TextMessage {
			// process text message
			log.Printf("Received TextMessage: %s\n", string(p))
			// proccess recieved text -------------
			// apply rules on text and send response to client with rule text and result
			for _, rule := range rule_classification_engine {
				// apply rule on text
				result, err := dsl.Evaluate(&rule.ASTNode, string(p))
				if err != nil {
					log.Println("Error evaluating rule: ", err)
					return
				}
				// send response to client with rule text and result
				responseMessage := "Rule: " + rule.RuleText + " : " + strconv.FormatBool(result.Bool)
				// fmt.Println(responseMessage)
				err = connection.WriteMessage(websocket.TextMessage, []byte(responseMessage))

				if err != nil {
					log.Println(err)
					return
				}
			}
			// ------------------------------------

			// write message to the connection to inform client that all rules are applied
			err = connection.WriteMessage(websocket.BinaryMessage, []byte{0})
			if err != nil {
				log.Println(err)
				return
			}
		}
		// if message type is not text message
		if messageType != websocket.TextMessage {
			log.Println("Message type is not TextMessage")
			// send error message to client
			err = connection.WriteMessage(websocket.TextMessage, []byte("Expected Text Message Type"))
			if err != nil {
				log.Println(err)
				return
			}
		}
		// conitnue reading messages from the connection
	}

}

// create rule classification engine function
func createRuleClassificationEngine(rules []models.Rule) ([]RuleInClassificationEngine, error) {
	// convert rules to rule ast
	rule_classification_engine := []RuleInClassificationEngine{}
	for _, rule := range rules {
		// convert rule json to ast
		var newAST dsl.ASTNode
		err := json.Unmarshal(rule.RuleJson, &newAST)
		if err != nil {
			log.Println("JSON unmarshaling error:", err)
			return nil, err
		}
		// add rule to rule classification engine
		rule_classification_engine = append(rule_classification_engine, RuleInClassificationEngine{
			RuleText: rule.RuleText,
			ASTNode:  newAST,
		})
	}

	// return rule classification engine as ast list
	return rule_classification_engine, nil

}
