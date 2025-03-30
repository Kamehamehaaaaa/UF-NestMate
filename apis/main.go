package main

import (
	"apis/cloudinary"
	"apis/database"
	"apis/router"

	"github.com/gin-gonic/gin"
)

func main() {
	database.MongoDB = database.NewMongoDBService()
	cloudinary.CloudinaryServiceInst = cloudinary.NewCloudinaryService()

	r := gin.Default()

	router.SetupHandlers(r)

	r.Run(":8080")
}
