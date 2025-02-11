package router

import (
	"apis/data"
	"apis/user"
	"encoding/json"
	"fmt"
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
		fmt.Fprintf(w, "Registration successful")
		w.WriteHeader(http.StatusOK)
	} else {
		fmt.Fprintf(w, "User already exists")
		w.WriteHeader(http.StatusConflict)
	}
}

func GetUsersHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data.Users)

}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	if verifyLogin(r.FormValue("username"), r.FormValue("password")) {
		fmt.Fprintf(w, "Login successful")
		w.WriteHeader(http.StatusOK)
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
