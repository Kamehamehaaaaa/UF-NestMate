package main

import (
	"apis/user"
	"encoding/json"
	"fmt"
	"net/http"
)

var (
	users = make(map[string]user.User)
)

func main() {
	fmt.Println("Running")
	http.HandleFunc("/api/register", registerHandler)
	http.HandleFunc("/api/users", getUsersHandler)
	http.HandleFunc("/api/login", loginHandler)
	http.ListenAndServe(":8080", nil)
	fmt.Println("Server up")
}

func displayUsers() {
	for _, user := range users {
		fmt.Println(user.FName)
	}
}

func registerHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	firstname := r.FormValue("firstname")
	lastname := r.FormValue("lastname")
	username := r.FormValue("username")
	password := r.FormValue("password")

	users[lastname] = user.User{FName: firstname, LName: lastname, UserName: username, Password: password}

	fmt.Fprintf(w, "Registration successful")
	w.WriteHeader(http.StatusOK)
}

func getUsersHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)

}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	if verifyLogin(r.FormValue("username"), r.FormValue("passowrd")) {

		fmt.Fprintf(w, "Login successful")
		w.WriteHeader(http.StatusOK)
	} else {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}
}

func verifyLogin(username string, password string) bool {
	return true
}
