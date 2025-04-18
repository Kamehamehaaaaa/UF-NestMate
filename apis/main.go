package main

import (
	"apis/cloudinary"
	"apis/database"
	"apis/router"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	httpSwagger "github.com/swaggo/http-swagger"
)

func main() {
	database.MongoDB = database.NewMongoDBService()
	cloudinary.CloudinaryServiceInst = cloudinary.NewCloudinaryService()

	r := gin.Default()

	r.StaticFile("/docs/swagger.yaml", "./docs/swagger.yaml")

	r.GET("/swagger/*any", gin.WrapH(httpSwagger.Handler(
		httpSwagger.URL("/docs/swagger.yaml"),
	)))

	router.SetupHandlers(r)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // default if running locally
	}

	log.Println("Running on port:", port)
	r.Run(":" + port)
}
