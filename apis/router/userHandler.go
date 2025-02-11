package router

import (
	"apis/data"
	"apis/user"
	"encoding/json"
	"net/http"
)

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	firstname := r.FormValue("firstname")
	lastname := r.FormValue("lastname")
	username := r.FormValue("username")
	password := r.FormValue("password")

	if !userExists(username) {
		data.Users[username] = user.User{FName: firstname, LName: lastname, UserName: username, Password: password}
		response := "Registration successful"
		http.Error(w, response, http.StatusOK)
	} else {
		response := "User with username " + username + " already exists"
		http.Error(w, response, http.StatusOK)
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
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	if verifyLogin(r.FormValue("username"), r.FormValue("password")) {
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
