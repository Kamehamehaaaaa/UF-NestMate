package router

import (
	"apis/cloudinary"
	"apis/database"
	"apis/housing"
	"bytes"
	"encoding/json"
	"io"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// Mock for MongoDB
type MockDatabase struct {
	mock.Mock
}

func TestAddHousingHandler(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	SetupHandlers(r)

	// _ := new(MockDatabase)
	database.MongoDB = database.NewMongoDBTestService()

	database.MongoDB.DeleteProperty("1")

	t.Run("Valid Property Data", func(t *testing.T) {
		property := housing.Housing{
			ID:          1,
			Name:        "Test property",
			Image:       "https://res.cloudinary.com/dbldemxes/image/upload/v1742855322/",
			Description: "A beautiful seaside apartment.",
			Address:     "123 Ocean Drive, Miami, FL",
			Vacancy:     5,
			Rating:      4.8,
		}
		jsonValue, _ := json.Marshal(property)
		req, _ := http.NewRequest("POST", "/api/housing/add", bytes.NewBuffer(jsonValue))

		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		mockResponse := `{"message":"Property stored successfully!"}`
		responseData, _ := io.ReadAll(w.Body)
		assert.Equal(t, mockResponse, string(responseData))
		assert.Equal(t, http.StatusOK, w.Code)
	})

	t.Run("Invalid JSON Data", func(t *testing.T) {
		body := `{"id": 1`
		req, _ := http.NewRequest(http.MethodPost, "/api/housing/add", strings.NewReader(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()

		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusBadRequest, w.Code)
		assert.Contains(t, w.Body.String(), "Invalid JSON data")
	})

	t.Run("Property already exists", func(t *testing.T) {
		property := housing.Housing{
			ID:          1,
			Name:        "Test property",
			Image:       "https://res.cloudinary.com/dbldemxes/image/upload/v1742855322/",
			Description: "A beautiful seaside apartment.",
			Address:     "123 Ocean Drive, Miami, FL",
			Vacancy:     5,
			Rating:      4.8,
		}
		jsonValue, _ := json.Marshal(property)
		req, _ := http.NewRequest("POST", "/api/housing/add", bytes.NewBuffer(jsonValue))

		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		mockResponse := `{"message":"Property with id already exists"}`
		responseData, _ := io.ReadAll(w.Body)
		assert.Equal(t, mockResponse, string(responseData))
		assert.Equal(t, http.StatusBadRequest, w.Code)
	})
}

func TestGetHousingHandler(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	SetupHandlers(r)

	// _ := new(MockDatabase)
	database.MongoDB = database.NewMongoDBTestService()

	t.Run("Get Property Data", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/api/housing/get/1", nil)

		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		assert.Contains(t, w.Body.String(), "Test property")
		assert.Equal(t, http.StatusOK, w.Code)
	})
}

func TestGetAllHousingHandler(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	SetupHandlers(r)

	// _ := new(MockDatabase)
	database.MongoDB = database.NewMongoDBTestService()

	t.Run("Get All Property Data", func(t *testing.T) {
		property := housing.Housing{
			ID:          2,
			Name:        "Test property 2",
			Image:       "https://res.cloudinary.com/dbldemxes/image/upload/v1742855322/",
			Description: "A beautiful seaside apartment.",
			Address:     "123 Ocean Drive, Miami, FL",
			Vacancy:     5,
			Rating:      4.8,
		}
		database.MongoDB.StoreProperty(&property)
		req, _ := http.NewRequest("GET", "/api/housing/getAll", nil)

		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		assert.Contains(t, w.Body.String(), "count\":2")
		assert.Equal(t, http.StatusOK, w.Code)
	})
}

func TestUpdateHousingHandler(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	SetupHandlers(r)

	// _ := new(MockDatabase)
	database.MongoDB = database.NewMongoDBTestService()

	t.Run("Update Property Data", func(t *testing.T) {
		property := housing.Housing{
			ID:          1,
			Name:        "Updated property Name",
			Image:       "https://res.cloudinary.com/dbldemxes/image/upload/v1742855322/",
			Description: "A beautiful seaside apartment.",
			Address:     "123 Ocean Drive, Miami, FL",
			Vacancy:     5,
			Rating:      4.8,
		}
		jsonValue, _ := json.Marshal(property)
		req, _ := http.NewRequest("PUT", "/api/housing/update", bytes.NewBuffer(jsonValue))

		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		mockResponse := `{"message":"Property updated successfully!"}`
		responseData, _ := io.ReadAll(w.Body)
		assert.Equal(t, mockResponse, string(responseData))
		assert.Equal(t, http.StatusOK, w.Code)
	})

	t.Run("Property doesnt exist", func(t *testing.T) {
		property := housing.Housing{
			ID:          5,
			Name:        "Update Property Name",
			Image:       "https://res.cloudinary.com/dbldemxes/image/upload/v1742855322/",
			Description: "A beautiful seaside apartment.",
			Address:     "123 Ocean Drive, Miami, FL",
			Vacancy:     5,
			Rating:      4.8,
		}
		jsonValue, _ := json.Marshal(property)
		req, _ := http.NewRequest("PUT", "/api/housing/update", bytes.NewBuffer(jsonValue))

		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		mockResponse := `{"message":"invalid update"}`
		responseData, _ := io.ReadAll(w.Body)
		assert.Equal(t, mockResponse, string(responseData))
		assert.Equal(t, http.StatusBadRequest, w.Code)
	})
}

func TestDeleteHousingHandler(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	SetupHandlers(r)

	// _ := new(MockDatabase)
	database.MongoDB = database.NewMongoDBTestService()

	t.Run("Delete Property", func(t *testing.T) {
		req, _ := http.NewRequest("DELETE", "/api/housing/delete/1", nil)

		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		mockResponse := `{"message":"Property deleted successfully!"}`
		responseData, _ := io.ReadAll(w.Body)
		assert.Equal(t, mockResponse, string(responseData))
		assert.Equal(t, http.StatusOK, w.Code)
	})

	t.Run("Invalid Delete", func(t *testing.T) {
		req, _ := http.NewRequest("DELETE", "/api/housing/delete/1", nil)

		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		mockResponse := `{"message":"invalid delete"}`
		responseData, _ := io.ReadAll(w.Body)
		assert.Equal(t, mockResponse, string(responseData))
		assert.Equal(t, http.StatusBadRequest, w.Code)
	})

}

func TestUploadImgHandler(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	SetupHandlers(r)

	// _ := new(MockDatabase)
	database.MongoDB = database.NewMongoDBTestService()
	cloudinary.CloudinaryServiceInst = cloudinary.NewCloudinaryTestService()

	t.Run("Upload image", func(t *testing.T) {
		body := &bytes.Buffer{}
		writer := multipart.NewWriter(body)
		part, _ := writer.CreateFormFile("image", "test.jpg")
		part.Write([]byte("fake image content"))
		writer.Close()

		req, _ := http.NewRequest("POST", "/api/housing/uploadimg", body)
		req.Header.Set("Content-Type", writer.FormDataContentType())

		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
	})
}
