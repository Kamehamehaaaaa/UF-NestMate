package router

import (
	"os"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupHandlers(r *gin.Engine) {

	allowedOrigins := strings.Split(os.Getenv("ALLOWED_ORIGINS"), ",")
	if len(allowedOrigins) == 0 {
		allowedOrigins = []string{"http://localhost:3000"}
	}

	// Add this loop to trim whitespace and normalize origins
	for i, origin := range allowedOrigins {
		allowedOrigins[i] = strings.TrimSpace(origin)
	}

	r.Use(cors.New(cors.Config{
		AllowOriginFunc: func(origin string) bool {
			// Allow requests with no origin (e.g., curl, Postman)
			if origin == "" {
				return true
			}
			// Check if the origin is in the allowed list
			for _, allowedOrigin := range allowedOrigins {
				if origin == allowedOrigin ||
					strings.HasPrefix(origin, allowedOrigin+"/") ||
					strings.HasPrefix(origin, strings.Replace(allowedOrigin, "http://", "https://", 1)) {
					return true
				}
			}
			return false
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.POST("/api/user/register", RegisterHandler)
	r.POST("/api/user/login", LoginHandler)
	r.GET("/api/user/getUser", GetUserHandler)
	r.PUT("/api/user/update", UpdateUserHandler)
	r.DELETE("/api/user/delete", DeleteUserHandler)
	r.POST("/api/housing/add", AddHousingHandler)
	r.GET("/api/housing/get/:query", GetHousingHandler)
	r.DELETE("/api/housing/delete/:query", DeleteHousingHandler)
	r.PUT("/api/housing/update", UpdateHousingHandler)
	r.GET("/api/housing/getAll", GetAllHousingHandler)
	r.POST("/api/housing/uploadimg", UploadImgHandler)
	r.GET("/apt/housing/sortByDistance", sortByDistanceHandler)
	r.POST("/api/comments/add", AddCommentHandler)
	r.DELETE("/api/comments/delete/:query", DeleteCommentHandler)
	r.GET("/api/comments/get/:query", GetCommentHandler)
	r.GET("/api/comments/getAll/:query", GetAllCommentsHandler)
	r.GET("/api/filter/ratings", filterRatingsHandler)

	// r.GET("/api/housing/summary/:query", ReviewSummarizerHandler)

	//new apis
	// Favorites endpoints
	r.POST("/api/user/favorites/add", AddFavoriteHandler)
	r.DELETE("/api/user/favorites/remove", RemoveFavoriteHandler)
	r.GET("/api/user/favorites", GetFavoritesHandler)

	r.GET("/api/housing/amenities/:query", GetNearbyAmenitiesHandler)
	r.PUT("/api/user/preferences", SavePreferencesHandler)
	r.GET("/api/user/preferences", GetPreferencesHandler)

	r.GET("/api/user/matches", GetMatchesHandler)
}
