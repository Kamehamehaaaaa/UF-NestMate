package router

import (
	"net/http"
	
)




func enableCORS(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        // Set CORS headers
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")

        // Handle preflight requests
        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }

        // Call the next handler
        next.ServeHTTP(w, r)
    }
}


func SetupHandlers() {
	http.HandleFunc("/api/user/register", enableCORS(RegisterHandler))
	http.HandleFunc("/api/users", enableCORS(GetUsersHandler))
	http.HandleFunc("/api/user/login", enableCORS(LoginHandler))
	http.HandleFunc("/api/housing/add", enableCORS(AddHousingHandler))
	http.HandleFunc("/api/housing/get", enableCORS(GetHousingHandler))
	http.HandleFunc("/api/housing/delete", enableCORS(DeleteHousingHandler))
	http.HandleFunc("/api/housing/update",enableCORS( UpdateHousingHandler))
	http.HandleFunc("/api/comments/add", enableCORS(addCommentHandler))
	http.HandleFunc("/api/comments/delete", enableCORS(deleteCommentHandler))
	http.HandleFunc("/api/comments/get", enableCORS(getCommentHandler))
}
