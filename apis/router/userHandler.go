package router

import (
	"apis/data"
	"apis/user"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

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
	fmt.Println(userPayload)
	if err != nil {
		http.Error(w, "Error unmarshalling JSON", http.StatusBadRequest)
		return
	}

	if !userExists(userPayload.UserName) {
		data.Users[userPayload.UserName] = user.User{UserId: time.Now().UnixNano(), FirstName: userPayload.FirstName,
			LastName: userPayload.LastName, UserName: userPayload.UserName, Password: userPayload.Password,
			Email: userPayload.Email}
		response := "Registration successful"
		http.Error(w, response, http.StatusOK)
	} else {
		response := "User with username " + userPayload.UserName + " already exists"
		http.Error(w, response, http.StatusBadRequest)
	}
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

	if verifyLogin(loginPayload.UserName, loginPayload.Password) {
		http.Error(w, "Login successful", http.StatusOK)
	} else {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}
}

func verifyLogin(username string, password string) bool {
	if user, exists := data.Users[username]; exists {
		return user.Password == password
	}
	return false
}

func userExists(username string) bool {
	if _, exists := data.Users[username]; exists {
		return true
	}
	return false
}
