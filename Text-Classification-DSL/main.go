package main

import (
	"github.com/survek/LDP-Hands-On-Projects/text-classification-dsl/config"
	"github.com/survek/LDP-Hands-On-Projects/text-classification-dsl/router"
)

func main() {
	// load env file
	config.InitDotEnv(".env")

	// connect to postgres db & migrate
	config.PostgresDBConnect()
	config.DBMigrate()

	// get gin app
	app := router.SetupRouter()

	// start gin app server
	app.Run(":8080")

}
