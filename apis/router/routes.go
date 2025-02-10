package router

import (
	"net/http"
)

func SetupHandlers() {
	http.HandleFunc("/api/register", RegisterHandler)
	http.HandleFunc("/api/users", GetUsersHandler)
	http.HandleFunc("/api/login", LoginHandler)
	http.HandleFunc("/api/housing/add", AddHousingHandler)
	http.HandleFunc("/api/housing/get", GetHousingHandler)
	http.HandleFunc("/api/housing/delete", DeleteHousingHandler)
	http.HandleFunc("/api/housing/update", UpdateHousingHandler)
}
