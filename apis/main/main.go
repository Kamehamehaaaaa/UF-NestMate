package main

import (
	"apis/data"
	"apis/router"
	"fmt"
	"net/http"
)

func main() {
	fmt.Println("Running")
	router.SetupHandlers()
	http.ListenAndServe(":8080", nil)
	fmt.Println("Server up")
}

func displayUsers() {
	for _, user := range data.Users {
		fmt.Println(user.FirstName)
	}
}
