package test

import (
	"log"
	"os"
	"testing"

	"github.com/joho/godotenv"
	"github.com/survek/LDP-Hands-On-Projects/text-classification-dsl/config"
	"github.com/survek/LDP-Hands-On-Projects/text-classification-dsl/models"
)

// setup db connection
func setupTestDB() {
	// setup .env.test file
	err := godotenv.Load(".env.test")
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	// setup db connection
	config.PostgresDBConnect()
	config.DBMigrate()

}

// teardown db connection
func teardownTestDB() {
	config.DB.Migrator().DropTable(&models.User{}, &models.Rule{})
}

func TestMain(m *testing.M) {

	// setup db connection
	setupTestDB()

	// run the tests
	code := m.Run()

	// teardown db connection
	teardownTestDB()

	// call with result of m.Run()
	os.Exit(code)
}
