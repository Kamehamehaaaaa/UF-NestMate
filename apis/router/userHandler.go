package router

import (
	"apis/data"
	"apis/user"
	"encoding/json"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"io"
	"net/http"
	"time"
	"golang.org/x/crypto/bcrypt"
)

var jwtSecretKey = []byte("secret-key") // Use an environment variable for production

// RegisterHandler handles user registration
func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	
	var userPayload user.UserPayload
	err = json.Unmarshal(body, &userPayload)
	if err != nil {
		http.Error(w, "Error unmarshalling JSON", http.StatusBadRequest)
		return
	}

	// Check if the user already exists
	if !userExists(userPayload.UserName) {
		
		data.Users[userPayload.UserName] = user.User{
			UserId:    time.Now().UnixNano(),
			FirstName: userPayload.FirstName,
			LastName:  userPayload.LastName,
			UserName:  userPayload.UserName,
			Password:  userPayload.Password, 
			Email:     userPayload.Email,
		}

		response := map[string]string{"message": "Registration successful"}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(response)
	} else {
		
		response := map[string]string{"message": "User with username " + userPayload.UserName + " already exists"}
		http.Error(w, response["message"], http.StatusBadRequest)
	}
}


// LoginHandler handles user login and JWT token creation
func LoginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	var loginPayload user.LoginPayload
	err = json.Unmarshal(body, &loginPayload)
	if err != nil {
		http.Error(w, "Error unmarshalling JSON", http.StatusBadRequest)
		return
	}

	// Verify the username and password
	if user, exists := data.Users[loginPayload.UserName]; exists {
		err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(loginPayload.Password))
		if err != nil {
			http.Error(w, "Invalid username or password", http.StatusUnauthorized)
			return
		}

		
		token := generateJWT(user.UserName)
		fmt.Print(token)

		// Send the JWT token back to the client
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"token": token})
	} else {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
	}
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



func GetUsersHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data.Users)
	w.WriteHeader(http.StatusOK)
}
func userExists(username string) bool {
	if _, exists := data.Users[username]; exists {
		return true
	}
	return false
}
