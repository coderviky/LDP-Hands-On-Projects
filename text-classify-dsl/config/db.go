package config

import (
	"log"
	"os"

	"github.com/survek/LDP-Hands-On-Projects/text-classification-dsl/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// this is for db related configurations

var dbError error
var DB *gorm.DB

// postgres db connect function
func PostgresDBConnect() {
	// create connection string using env variables
	postgres_dsn := "host=" + os.Getenv("PGHOST") + " user=" + os.Getenv("PGUSER") + " password=" + os.Getenv("PGPASSWORD") + " dbname=" + os.Getenv("PGDATABASE") + " sslmode=" + os.Getenv("SSLMODE") + " TimeZone=" + os.Getenv("TIMEZONE")

	log.Println("Connecting to database")

	// open a db connection
	DB, dbError = gorm.Open(postgres.Open(postgres_dsn), &gorm.Config{})

	if dbError != nil {
		log.Fatal(dbError)
		panic("Failed to connect to database")
	}

	log.Println("Connected to database")

}

// migration function
func DBMigrate() {
	// gorm auto migrate
	DB.AutoMigrate(&models.User{})
	log.Println("Database migration completed")
}
