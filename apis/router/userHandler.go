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
	if userExists(user.Username) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User with username " + user.Username + " already exists"})
		return
	} else {

		if user.Favorites == nil {
			user.Favorites = []int{}
		}
		err := database.MongoDB.RegisterUser(&user)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error while adding the user"})
			return
		}
		c.JSON(http.StatusCreated, gin.H{
			"message":  "User registered successfully",
			"username": user.Username,
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

	if user.Username == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username is required"})
		return
	}

	err := database.MongoDB.UpdateUser(user.Username, user)
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



func AddFavoriteHandler(c *gin.Context) {
    var req struct {
        Username string `json:"username"`
        AptID    int    `json:"aptId"`
    }
    
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
        return
    }

    // Verify user exists
    if !userExists(req.Username) {
        c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }
		 fmt.Printf(req.Username)
    err := database.MongoDB.AddFavorite(req.Username, req.AptID)
    if err != nil {
        log.Printf("Add favorite error: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add favorite"})
        return
    }
    
    c.JSON(http.StatusOK, gin.H{
        "message": "Added to favorites",
        "success": true,
    })
}

// RemoveFavoriteHandler removes an apartment from favorites
func RemoveFavoriteHandler(c *gin.Context) {
    var req struct {
        Username string `json:"username"`
        AptID    int    `json:"aptId"`
    }
    
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
        return
    }

    err := database.MongoDB.RemoveFavorite(req.Username, req.AptID)
    if err != nil {
        log.Printf("Remove favorite error: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove favorite"})
        return
    }
    
    c.JSON(http.StatusOK, gin.H{
        "message": "Removed from favorites",
        "success": true,
    })
}

// GetFavoritesHandler retrieves user's favorite apartments
func GetFavoritesHandler(c *gin.Context) {
    username := c.Query("username")
    
    if username == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Username is required"})
        return
    }

    favorites, err := database.MongoDB.GetFavorites(username)
    if err != nil {
        log.Printf("Get favorites error: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve favorites"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "count": len(favorites),
        "favorites": favorites,
    })
}


func GetPreferencesHandler(c *gin.Context) {
	username := c.Query("username")
	if username == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username is required"})
		return
	}

	preferences, err := database.MongoDB.GetPreferences(username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve preferences"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"preferences": preferences})
}


func SavePreferencesHandler(c *gin.Context) {
	var req struct {
		Username    string       `json:"username"`
		Preferences user.Preferences  `json:"preferences"`
	}

	// Print all preferences to console
	fmt.Printf("Received preferences for user %s:\n", req.Username)
	fmt.Printf("Budget: Min=%d, Max=%d\n", req.Preferences.Budget.Min, req.Preferences.Budget.Max)
	fmt.Printf("Major: %s\n", req.Preferences.Major)
	fmt.Printf("Hobbies: %s\n", req.Preferences.Hobbies)
	fmt.Printf("Food: %s\n", req.Preferences.Food)
	fmt.Printf("Sleeping Habit: %s\n", req.Preferences.SleepingHabit)
	fmt.Printf("Smoking/Drinking: %s\n", req.Preferences.SmokingDrinking)
	fmt.Printf("Cleanliness: %d\n", req.Preferences.Cleanliness)
	fmt.Printf("Gender Preference: %s\n", req.Preferences.GenderPreference)
	fmt.Printf("Pet Preference: %s\n", req.Preferences.PetPreference)

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	err := database.MongoDB.SavePreferences(req.Username, req.Preferences)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save preferences"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Preferences saved successfully"})
}



// GetMatchesHandler retrieves users whose preferences match the current user's preferences
func GetMatchesHandler(c *gin.Context) {
	username := c.Query("username")
	if username == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username is required"})
		return
	}

	// Fetch current user's preferences
	currentUser, err := database.MongoDB.GetUserByUsername(username)
	if err != nil {
		log.Printf("Error fetching user: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user"})
		return
	}

	if currentUser.Preferences == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User has no preferences set"})
		return
	}

	// Fetch all users from the database
	allUsers, err := database.MongoDB.GetAllUsers()
	if err != nil {
		log.Printf("Error fetching all users: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve users"})
		return
	}

	var matches []user.User

	for _, potentialMatch := range allUsers {
		if potentialMatch.Username == currentUser.Username {
			continue // Skip comparing with self
		}

		if isPreferencesMatch(currentUser.Preferences, potentialMatch.Preferences) {
			matches = append(matches, potentialMatch)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"matches": matches,
	})
}

// Helper function to compare preferences
func isPreferencesMatch(pref1, pref2 *user.Preferences) bool {
	if pref1 == nil || pref2 == nil {
		return false
	}

	return pref1.Budget.Min <= pref2.Budget.Max &&
		pref1.Budget.Max >= pref2.Budget.Min &&
		pref1.SmokingDrinking == pref2.SmokingDrinking &&
		pref1.Cleanliness == pref2.Cleanliness
}
