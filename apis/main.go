package main

import (
	"fmt"
	"net/http"

	"log"
	"time"

	"sort"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"

	"encoding/json"
	"net/url"
    "strings"
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
	username := c.Query("username")
	user, err := mongoDBService.GetUserByUsername(username)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	user.Password = ""
	c.JSON(http.StatusOK, user)
}

func updateUserHandler(c *gin.Context) {
	var updatedUser User
	if err := c.ShouldBindJSON(&updatedUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
		return
	}

	if updatedUser.Username == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username is required"})
		return
	}

	err := mongoDBService.UpdateUser(updatedUser.Username, updatedUser)
	if err != nil {
		if err.Error() == "user not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User updated successfully"})
}

func sortByDistanceHandler(c *gin.Context) {
	log.Println("Handler reached")
	university := c.Query("university")
	if university == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "University name is required"})
		return
	}

	apartmentList, err := mongoDBService.GetAllProperties()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch apartments"})
		return
	}

	if len(apartmentList) == 0 {
		c.JSON(http.StatusOK, gin.H{"message": "No apartments found"})
		return
	}

	var destinations []string
	for _, apartment := range apartmentList {
		destinations = append(destinations, apartment.Address)
	}
    log.Println(destinations)

	distances, err := getDistances(university, destinations)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to calculate distances"})
		return
	}
	fmt.Println("r")
	fmt.Println(distances)
	fmt.Println("distances")

	type ApartmentWithDistance struct {
		Property
		Distance float64
	}
	var apartmentsWithDistance []ApartmentWithDistance

	for i, apartment := range apartmentList {
		if i < len(distances) {
			distanceInMeters := distances[i] 

			log.Printf("Apartment %s is %.2f km away from the university", apartment.Name, distanceInMeters/1000)

			apartmentsWithDistance = append(apartmentsWithDistance, ApartmentWithDistance{
				Property: apartment,
				Distance: distanceInMeters,
			})
		}
	}

	sort.Slice(apartmentsWithDistance, func(i, j int) bool {
		return apartmentsWithDistance[i].Distance < apartmentsWithDistance[j].Distance
	})

	var sortedProperties []Property
	for _, apt := range apartmentsWithDistance {
		sortedProperties = append(sortedProperties, apt.Property)
	}

	c.JSON(http.StatusOK, sortedProperties)
}

func getDistances(origin string, destinations []string) ([]float64, error) {
	apiKey := "AIzaSyCJbMwl9Jpmbhx863HaRaQDu7iSMPjiK9Y" 
	destString := url.QueryEscape(strings.Join(destinations, "|"))
	apiURL := fmt.Sprintf(
		"https://maps.googleapis.com/maps/api/distancematrix/json?origins=%s&destinations=%s&key=%s",
		url.QueryEscape(origin), destString, apiKey,
	)

	log.Printf("API URL: %s\n", apiURL) 
	
	resp, err := http.Get(apiURL)
	if err != nil || resp.StatusCode != http.StatusOK {
		log.Printf("Failed to call Google Distance Matrix API: %v", err)
		return nil, fmt.Errorf("failed to fetch distances")
	}
	defer resp.Body.Close()
	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		log.Printf("Failed to parse Google Distance Matrix API response: %v", err)
		return nil, fmt.Errorf("failed to parse response")
	}

	log.Printf("API Response: %+v\n", result) 

	var distances []float64
	rows, ok := result["rows"].([]interface{})
	if !ok {
		return nil, fmt.Errorf("invalid response format")
	}
	for _, row := range rows {
		rowMap, ok := row.(map[string]interface{})
		if !ok {
			continue
		}

		elements, ok := rowMap["elements"].([]interface{})
		if !ok {
			continue
		}

		for i, element := range elements {
			elementMap, ok := element.(map[string]interface{})
			if !ok {
				log.Printf("Skipping element %d: invalid format", i)
				continue
			}

			status, ok := elementMap["status"].(string)
			if !ok || status != "OK" {
				log.Printf("Skipping element %d: status=%s", i, status)
				continue 
			}

			distanceMap, ok := elementMap["distance"].(map[string]interface{})
			if !ok {
				log.Printf("Skipping element %d: missing distance", i)
				continue
			}

			distanceValue, ok := distanceMap["value"].(float64) 
			if ok {
				distances = append(distances, distanceValue)
				log.Printf("Added distance for element %d: %.2f meters", i, distanceValue)
			}
		}
	}

	log.Printf("Final Distances: %+v\n", distances) 

	return distances, nil
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
	r.PUT("/user", updateUserHandler)
	r.GET("/apt/sortByDistance", sortByDistanceHandler)
	r.Run(":8080")
}
