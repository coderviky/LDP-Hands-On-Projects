package controller

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

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
	// userId, _ := c.Get("userId")
	// email, _ := c.Get("email")

	// check user id - if required

	// upgrade the connection to a websocket connection
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
			log.Printf("Received TextMessage: %s\n", string(p))
		}

		// proccess recieved text -------------

		// ------------------------------------

		// write message to the connection
		// message := "Hey " + fmt.Sprint(userId) + ", Hello from server"
		// response flag true or false using message type as BinaryMessage
		err = connection.WriteMessage(websocket.BinaryMessage, []byte{1})

		if err != nil {
			log.Println(err)
			return
		}
	}

}
