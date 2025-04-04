package router

import (
	"apis/database"
	"apis/user"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

var jwtSecretKey = []byte("secret-key") // Use an environment variable for production

// RegisterHandler handles user registration
func RegisterHandler(c *gin.Context) {
	var user user.User

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
		return
	}

	// Check if the user already exists
	if userExists(user.UserName) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User with username " + user.UserName + " already exists"})
		return
	} else {
		err := database.MongoDB.RegisterUser(&user)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error while adding the user"})
			return
		}
		c.JSON(http.StatusCreated, gin.H{
			"message":  "User registered successfully",
			"username": user.UserName,
		})
		return
	}
}

// LoginHandler handles user login and JWT token creation
func LoginHandler(c *gin.Context) {
	var loginReq user.LoginPayload

	if err := c.ShouldBindJSON(&loginReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
		return
	}

	storedUser, err := database.MongoDB.GetUserByUsername(loginReq.Username)
	if err != nil {
		log.Printf("Login error: %v", err)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	err = bcrypt.CompareHashAndPassword(
		[]byte(storedUser.Password),
		[]byte(loginReq.Password),
	)

	if err != nil {
		log.Printf("Password mismatch for user: %s", loginReq.Username)
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

func generateJWT(username string) string {

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": username,
		"exp":      time.Now().Add(1 * time.Hour).Unix(), // Expiry time
	})

	tokenString, err := token.SignedString(jwtSecretKey)
	if err != nil {
		fmt.Println("Error signing the token:", err)
		return ""
	}
	return tokenString
}

func GetUserHandler(c *gin.Context) {
	query := c.Query("username")

	fmt.Println(query)

	user, err := database.MongoDB.GetUserByUsername(query)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func UpdateUserHandler(c *gin.Context) {
	var user user.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
		return
	}

	fmt.Println("herer")
	fmt.Println(user)

	if user.UserName == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username is required"})
		return
	}

	err := database.MongoDB.UpdateUser(user.UserName, user)
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

func DeleteUserHandler(c *gin.Context) {
	query := c.Query("username")

	// Check if the user already exists
	if !userExists(query) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User with username " + query + " doesnt exist"})
		return
	} else {
		err := database.MongoDB.DeleteUser(query)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error while deleting the user"})
			return
		}
		c.JSON(http.StatusNoContent, gin.H{"message": "User deleted successfully"})
		return
	}
}

func userExists(username string) bool {
	_, err := database.MongoDB.GetUserByUsername(username)
	return err == nil
}
