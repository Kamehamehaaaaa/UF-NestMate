// package main

// import (
// 	"apis/data"
// 	"apis/router"
// 	"fmt"
// 	"net/http"
// )

// func main() {
// 	fmt.Println("Running")
// 	router.SetupHandlers()
// 	http.ListenAndServe("0.0.0.0:8080", nil)
// 	fmt.Println("Server up")
// }

// func displayUsers() {
// 	for _, user := range data.Users {
// 		fmt.Println(user.FirstName)
// 	}
// }

package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors" 
	"log"
	"time"
)

var mongoDBService *MongoDBService
var cloudinaryService *CloudinaryService

func init() {
	mongoDBService = NewMongoDBService()
	cloudinaryService = NewCloudinaryService() 
}

type User struct {
    Username string `json:"username" bson:"username"`
    Password string `json:"password" bson:"password"`
}

// will receive property details in JSON and store them in MongoDB
func aptHandler(c *gin.Context) {
	var property Property
	if err := c.ShouldBindJSON(&property); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid JSON data"})
		return
	}

	err := mongoDBService.StoreProperty(&property)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to store property data"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Property stored successfully!"})
}


// retrieves property details using ID or Name
func pullHandler(c *gin.Context) {
	query := c.Param("query")

	property, err := mongoDBService.GetProperty(query)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Property not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"property": property})
}

func pullAllHandler(c *gin.Context) {
    properties, err := mongoDBService.GetAllProperties()
    if err != nil {
        log.Printf("Database error: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{
            "error": "Failed to retrieve properties",
            "details": "Database operation failed",
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "count": len(properties),
        "properties": properties,
    })
}


// uploads image to cloudinary 
func imgHandler(c *gin.Context) {
	
	file, header, err := c.Request.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to get image"})
		return
	}
	defer file.Close() 

	_, err = cloudinaryService.UploadImage(file, header.Filename)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload image to Cloudinary"})
		return
	}

	c.Status(http.StatusOK)
}

func userHandler(c *gin.Context) {
    var user User

    if err := c.ShouldBindJSON(&user); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
        return
    }

    if user.Username == "" || user.Password == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Username and password are required"})
        return
    }

    err := mongoDBService.StoreUser(&user)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store user data"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "User created successfully!"})
}


func main() {
	r := gin.Default()

	 // Add CORS configuration
	 r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:3000"},
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
        AllowHeaders:     []string{"Origin", "Content-Type"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge:           12 * time.Hour,
    }))
	r.POST("/apt", aptHandler)      
	r.GET("/pull/:query", pullHandler) 
	r.GET("/pull", pullAllHandler) 
	r.POST("/img", imgHandler)
	r.POST("/user", userHandler)

	r.Run(":8080")
}