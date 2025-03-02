package router

import (
	"net/http"
)

func SetupHandlers() {
	http.HandleFunc("/api/user/register", RegisterHandler)
	http.HandleFunc("/api/users", GetUsersHandler)
	http.HandleFunc("/api/user/login", LoginHandler)
	http.HandleFunc("/api/housing/add", AddHousingHandler)
	http.HandleFunc("/api/housing/get", GetHousingHandler)
	http.HandleFunc("/api/housing/delete", DeleteHousingHandler)
	http.HandleFunc("/api/housing/update", UpdateHousingHandler)
	http.HandleFunc("/api/comments/add", addCommentHandler)
	http.HandleFunc("/api/comments/delete", deleteCommentHandler)
	http.HandleFunc("/api/comments/get", getCommentHandler)
}
