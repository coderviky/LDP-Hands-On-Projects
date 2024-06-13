package config

import (
	"log"

	"github.com/joho/godotenv"
)

// init function to load env file
func InitDotEnv(envfilename string) {
	// load env file
	err := godotenv.Load(envfilename)
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}
