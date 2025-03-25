package main

import (
	"apis/database"
	"apis/data"
	"apis/router"
	"fmt"
	"net/http"
)

func main() {

	database.ConnectToMongoDB()
	defer database.CloseMongoDBConnection()
	fmt.Println("Running")
	router.SetupHandlers()
	http.ListenAndServe("0.0.0.0:8080", nil)
	fmt.Println("Server up")
}

func displayUsers() {
	for _, user := range data.Users {
		fmt.Println(user.FirstName)
	}
}
