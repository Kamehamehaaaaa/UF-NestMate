package router

import (
	"apis/database"
	"apis/user"
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestRegisterHandler(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	SetupHandlers(r)

	// _ := new(MockDatabase)
	database.MongoDB = database.NewMongoDBTestService()

	t.Run("Register User Success", func(t *testing.T) {
		database.MongoDB.DeleteUser("jchan")
		user := user.User{
			FirstName: "jackie",
			LastName:  "chan",
			Username:  "jchan",
			Password:  "qwe",
		}
		jsonValue, _ := json.Marshal(user)
		req, _ := http.NewRequest("POST", "/api/user/register", bytes.NewBuffer(jsonValue))

		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		mockResponse := `{"message":"User registered successfully","username":"jchan"}`
		responseData, _ := io.ReadAll(w.Body)
		assert.Equal(t, mockResponse, string(responseData))
		assert.Equal(t, http.StatusCreated, w.Code)
	})

	t.Run("Register User Failure", func(t *testing.T) {
		// database.MongoDB.DeleteUser("jchan")
		user := user.User{
			FirstName: "jackie",
			LastName:  "chan",
			Username:  "jchan",
			Password:  "qwe",
		}
		jsonValue, _ := json.Marshal(user)
		req, _ := http.NewRequest("POST", "/api/user/register", bytes.NewBuffer(jsonValue))

		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		mockResponse := `{"error":"User with username jchan already exists"}`
		responseData, _ := io.ReadAll(w.Body)
		assert.Equal(t, mockResponse, string(responseData))
		assert.Equal(t, http.StatusBadRequest, w.Code)
	})
}

func TestUpdateUserHandler(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	SetupHandlers(r)

	// _ := new(MockDatabase)
	database.MongoDB = database.NewMongoDBTestService()

	t.Run("Update User Success", func(t *testing.T) {

		updatedUser := user.User{
			FirstName: "jackie 2",
			LastName:  "chan",
			Username:  "jchan",
			Password:  "qwe",
		}

		jsonValue, _ := json.Marshal(updatedUser)
		req, _ := http.NewRequest("PUT", "/api/user/update", bytes.NewBuffer(jsonValue))

		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		mockResponse := `{"message":"User updated successfully"}`
		responseData, _ := io.ReadAll(w.Body)
		assert.Equal(t, mockResponse, string(responseData))
		assert.Equal(t, http.StatusOK, w.Code)
	})
}

func TestDeleteHandler(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	SetupHandlers(r)

	// _ := new(MockDatabase)
	database.MongoDB = database.NewMongoDBTestService()

	t.Run("Delete User Success", func(t *testing.T) {
		user := user.User{
			FirstName: "jackie",
			LastName:  "chan",
			Username:  "jchan",
			Password:  "qwe",
		}
		database.MongoDB.RegisterUser(&user)
		req, _ := http.NewRequest("DELETE", "/api/user/delete", nil)

		q := req.URL.Query()
		q.Add("username", "jchan")
		req.URL.RawQuery = q.Encode()

		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusNoContent, w.Code)
	})
	t.Run("Delete User Failure", func(t *testing.T) {
		req, _ := http.NewRequest("DELETE", "/api/user/delete", nil)

		q := req.URL.Query()
		q.Add("username", "jchan")
		req.URL.RawQuery = q.Encode()

		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusBadRequest, w.Code)

		mockResponse := `{"error":"User with username jchan doesnt exist"}`
		responseData, _ := io.ReadAll(w.Body)
		assert.Equal(t, mockResponse, string(responseData))
		assert.Equal(t, http.StatusBadRequest, w.Code)
	})
}

func TestGetUserHandler(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	SetupHandlers(r)

	// _ := new(MockDatabase)
	database.MongoDB = database.NewMongoDBTestService()

	t.Run("Get User Success", func(t *testing.T) {
		user := user.User{
			FirstName: "jackie",
			LastName:  "chan",
			Username:  "jchan",
			Password:  "qwe",
		}
		database.MongoDB.RegisterUser(&user)
		req, _ := http.NewRequest("GET", "/api/user/getUser", nil)

		q := req.URL.Query()
		q.Add("username", "jchan")
		req.URL.RawQuery = q.Encode()

		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		responseData, _ := io.ReadAll(w.Body)
		assert.Contains(t, string(responseData), "jackie")
		assert.Equal(t, http.StatusOK, w.Code)

	})
	t.Run("Get User Failure", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/api/user/getUser", nil)

		q := req.URL.Query()
		q.Add("username", "dunce")
		req.URL.RawQuery = q.Encode()

		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		mockResponse := `{"error":"User not found"}`
		responseData, _ := io.ReadAll(w.Body)
		assert.Equal(t, string(responseData), mockResponse)
		assert.Equal(t, http.StatusNotFound, w.Code)

	})
}

func TestLoginHandler(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	SetupHandlers(r)

	// _ := new(MockDatabase)
	database.MongoDB = database.NewMongoDBTestService()

	user1 := user.User{
		FirstName: "dummy login",
		LastName:  "user",
		Username:  "login",
		Password:  "password",
	}
	database.MongoDB.RegisterUser(&user1)

	t.Run("Login User Success", func(t *testing.T) {

		loginReq := user.LoginPayload{
			Username: "login",
			Password: "password",
		}

		jsonValue, _ := json.Marshal(loginReq)
		req, _ := http.NewRequest("POST", "/api/user/login", bytes.NewBuffer(jsonValue))

		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		responseData, _ := io.ReadAll(w.Body)
		assert.Contains(t, string(responseData), "Login successful")
		assert.Equal(t, http.StatusOK, w.Code)

	})

	t.Run("Login User failure", func(t *testing.T) {

		loginReq := user.LoginPayload{
			Username: "login1111",
			Password: "password",
		}

		jsonValue, _ := json.Marshal(loginReq)
		req, _ := http.NewRequest("POST", "/api/user/login", bytes.NewBuffer(jsonValue))

		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		mockResponse := `{"error":"Invalid credentials"}`
		responseData, _ := io.ReadAll(w.Body)
		assert.Equal(t, string(responseData), mockResponse)
		assert.Equal(t, http.StatusUnauthorized, w.Code)

	})
}
