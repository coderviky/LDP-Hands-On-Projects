package main

import (
	"github.com/gin-gonic/gin"
	"github.com/survek/LDP-Hands-On-Projects/text-classification-dsl/config"
	"github.com/survek/LDP-Hands-On-Projects/text-classification-dsl/controller"
	"github.com/survek/LDP-Hands-On-Projects/text-classification-dsl/middleware"
)

func main() {
	// load env file
	config.InitDotEnv(".env")

	// connect to postgres db & migrate
	config.PostgresDBConnect()
	config.DBMigrate()

	// create a gin app
	app := gin.Default()

	app.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Hello",
		})
	})

	// create group route for '/api'
	api := app.Group("/api")

	// add user routes --------------
	user_api := api.Group("/user")
	user_api.POST("/register", controller.RegisterUserHandler)
	user_api.POST("/login", controller.LoginUserHandler)

	// add rule routes with auth middleware --------------
	rule_api := api.Group("/rule").Use(middleware.AuthMiddleware())
	rule_api.POST("/create", controller.CreateRuleHandler)
	rule_api.GET("/list", controller.ListRulesHandler)
	rule_api.GET("/:id", controller.GetRuleHandler)
	rule_api.PUT("/:id", controller.UpdateRuleHandler)
	rule_api.DELETE("/:id", controller.DeleteRuleHandler)

	// add text classification routes with auth middleware --------------
	text_api := api.Group("/text").Use(middleware.AuthMiddleware())
	text_api.GET("/classify", controller.ClassifyTextHandler)

	// ---------------------

	// start gin app server
	app.Run(":8080")

}
