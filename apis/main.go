package main

import (
	"apis/cloudinary"
	"apis/database"
	"apis/router"

	"github.com/gin-gonic/gin"
  "github.com/swaggo/http-swagger"
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

	r.Run(":8080")
}
