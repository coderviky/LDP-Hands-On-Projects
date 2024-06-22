package main

// websocket test - Client connecting to server

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/gorilla/websocket"
)

// Credentials represents the structure for login credentials
type Credentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// LoginResponse represents the structure of the login response
type LoginResponse struct {
	Token string `json:"token"`
}

func getToken(url, email, password string) (string, error) {
	// Create the credentials payload
	credentials := Credentials{Email: email, Password: password}
	jsonData, err := json.Marshal(credentials)
	if err != nil {
		return "", err
	}

	// Send the POST request
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	// Read the response body
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	// Check for non-200 status codes
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("failed to login: %s", body)
	}

	token, err := strconv.Unquote(string(body))
	if err != nil {
		return "", err
	}

	return token, nil

}

func main() {
	// URL for the login endpoint
	loginURL := "http://127.0.0.1:8080/api/user/login"
	email := "abc@xyz.com"
	password := "123456"

	// Get the token
	token, err := getToken(loginURL, email, password)
	if err != nil {
		log.Fatalf("Failed to get token: %v", err)
	}

	// WebSocket server URL
	serverURL := "ws://127.0.0.1:8080/api/text/classify"
	header := http.Header{}
	// log.Println("Token: ", token)
	header.Set("Authorization", "Bearer "+token)

	// Dial the WebSocket server
	conn, _, err := websocket.DefaultDialer.Dial(serverURL, header)
	if err != nil {
		log.Fatalf("Failed to connect to WebSocket server: %v", err)
	}
	defer conn.Close()

	for {
		// Send a text message
		// take input from user
		reader := bufio.NewReader(os.Stdin)
		fmt.Print("Enter the text to classify: ")
		Text, err := reader.ReadString('\n')
		Text = Text[:len(Text)-1]
		if err != nil {
			log.Println("Error reading text:", err)
			return
		}

		err = conn.WriteMessage(websocket.TextMessage, []byte(Text))
		if err != nil {
			log.Println("Error sending Text:", err)
			return
		}

		// read message from the connection unitl message type is websocket.BinaryMessage and response is 0
		for {
			messageType, p, err := conn.ReadMessage()
			if err != nil {
				log.Println("Error reading message:", err)
				return
			}
			if messageType == websocket.BinaryMessage {
				if p[0] == 0 {
					break
				}
			}
			if messageType == websocket.TextMessage {
				fmt.Printf("  %s\n", string(p))
			}
		}
	}
}
