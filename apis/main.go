package main

import (
	"fmt"
	"net/http"

	"log"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

var mongoDBService *MongoDBService
var cloudinaryService *CloudinaryService

func init() {
	mongoDBService = NewMongoDBService()
	cloudinaryService = NewCloudinaryService()
}

type User struct {
	Username  string `json:"username" bson:"username"`
	Password  string `json:"password" bson:"password"`
	FirstName string `json:"firstName" bson:"firstName"`
	LastName  string `json:"lastName" bson:"lastName"`
}

type CommentRequest struct {
	ApartmentID int    `json:"apartmentId"`
	Comment     string `json:"comment"`
}

func registerUserHandler(c *gin.Context) {
	var user User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := mongoDBService.RegisterUser(&user)
	if err != nil {
		log.Printf("Database error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to register user",
			"details": "Database operation failed",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":  "User registered successfully",
		"username": user.Username,
	})
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
			"error":   "Failed to retrieve properties",
			"details": "Database operation failed",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"count":      len(properties),
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

func commentHandler(c *gin.Context) {
	var req CommentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}
	fmt.Print(req.Comment + "cn")

	err := mongoDBService.AddComment(req.ApartmentID, req.Comment)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save comment"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Comment added successfully"})
}

func loginUserHandler(c *gin.Context) {
	var loginUser struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&loginUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	storedUser, err := mongoDBService.GetUserByUsername(loginUser.Username)
	if err != nil {
		log.Printf("Login error: %v", err)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	err = bcrypt.CompareHashAndPassword(
		[]byte(storedUser.Password),
		[]byte(loginUser.Password),
	)
	if err != nil {
		log.Printf("Password mismatch for user: %s", loginUser.Username)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"user": gin.H{

			"firstName": storedUser.FirstName,
			"lastName":  storedUser.LastName,
		},
	})
}

func getUserByUsernameHandler(c *gin.Context) {
	username := c.Query("username") // Get username from query params
	user, err := mongoDBService.GetUserByUsername(username)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	user.Password = "" // Remove sensitive data
	c.JSON(http.StatusOK, user)
}

func filterRatingsHandler(c *gin.Context) {
	properties, err := mongoDBService.GetPropertiesSortedByRating()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching properties"})
		return
	}

	c.JSON(http.StatusOK, properties)
}

func main() {
	r := gin.Default()

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
	r.POST("/comment", commentHandler)
	r.POST("/register", registerUserHandler)
	r.POST("/login", loginUserHandler)
	r.GET("/user", getUserByUsernameHandler)

	r.Run(":8080")
}
