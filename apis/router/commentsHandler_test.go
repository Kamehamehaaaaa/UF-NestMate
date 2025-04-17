package router

import (
	"apis/comments"
	"apis/database"
	"apis/housing"
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestAddCommentHandler(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	SetupHandlers(r)

	// _ := new(MockDatabase)
	database.MongoDB = database.NewMongoDBTestService()

	property := housing.Housing{
		ID:          1,
		Name:        "Test property",
		Image:       "https://res.cloudinary.com/dbldemxes/image/upload/v1742855322/",
		Description: "A beautiful seaside apartment.",
		Address:     "123 Ocean Drive, Miami, FL",
		Vacancy:     5,
		Rating:      4.8,
		Comments:    []string{},
	}

	t.Run("Add comment successful", func(t *testing.T) {
		comment := comments.Comments{ApartmentID: 1, Comment: "Test comment"}
		database.MongoDB.StoreProperty(&property)
		jsonValue, _ := json.Marshal(comment)
		req, _ := http.NewRequest("POST", "/api/comments/add", bytes.NewBuffer(jsonValue))

		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		mockResponse := `{"message":"Comment added successfully"}`
		responseData, _ := io.ReadAll(w.Body)
		assert.Equal(t, mockResponse, string(responseData))
		assert.Equal(t, http.StatusOK, w.Code)
	})

	t.Run("Add comment failed", func(t *testing.T) {
		comment := comments.Comments{ApartmentID: 101, Comment: "Test comment"}
		database.MongoDB.StoreProperty(&property)
		jsonValue, _ := json.Marshal(comment)
		req, _ := http.NewRequest("POST", "/api/comments/add", bytes.NewBuffer(jsonValue))

		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		mockResponse := `{"error":"The apartment doesnt exist"}`
		responseData, _ := io.ReadAll(w.Body)
		assert.Equal(t, mockResponse, string(responseData))
		assert.Equal(t, http.StatusBadRequest, w.Code)
	})
}

func TestGetAllCommentsHandler(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	SetupHandlers(r)

	// _ := new(MockDatabase)
	database.MongoDB = database.NewMongoDBTestService()

	t.Run("Get All Comments Success", func(t *testing.T) {
		property := housing.Housing{
			ID:          2,
			Name:        "Test property 2",
			Image:       "https://res.cloudinary.com/dbldemxes/image/upload/v1742855322/",
			Description: "A beautiful seaside apartment.",
			Address:     "123 Ocean Drive, Miami, FL",
			Vacancy:     5,
			Rating:      4.8,
			Comments:    []string{"test comment 1", "test comment 2", "test comment 3"},
		}
		database.MongoDB.StoreProperty(&property)
		req, _ := http.NewRequest("GET", "/api/comments/getAll/2", nil)

		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		// assert.Contains(t, w.Body.String(), "count\":")
		assert.Equal(t, http.StatusOK, w.Code)
	})

	t.Run("get all comments failed", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/api/comments/getAll/100", nil)

		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		mockResponse := `{"error":"apartment doesnt exist"}`
		responseData, _ := io.ReadAll(w.Body)
		assert.Equal(t, mockResponse, string(responseData))
		assert.Equal(t, http.StatusBadRequest, w.Code)
	})
}

func TestDeleteCommentHandler(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	SetupHandlers(r)

	// _ := new(MockDatabase)
	database.MongoDB = database.NewMongoDBTestService()

	t.Run("Delete comment", func(t *testing.T) {
		req, _ := http.NewRequest("DELETE", "/api/comments/delete/1", nil)

		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
	})
}
