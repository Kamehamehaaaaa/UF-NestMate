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
	http.HandleFunc("/register", registerHandler)
	http.HandleFunc("/users", getUsersHandler)
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
}

func getUsersHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)

}
