package router

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupHandlers(r *gin.Engine) {

	// Add CORS configuration
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
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
	r.GET("/api/housing/summary", ReviewSummarizerHandler)

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
