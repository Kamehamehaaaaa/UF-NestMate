package router

import (
	"apis/data"
	"apis/housing"
	"apis/user"
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestRegisterUserHandler(t *testing.T) {
	data.Users = make(map[string]user.User)

	userPayload := user.UserPayload{
		FirstName: "John",
		LastName:  "Doe",
		UserName:  "jdoe",
		Password:  "anon",
	}
	payloadBytes, _ := json.Marshal(userPayload)

	req, err := http.NewRequest("POST", "/api/user/register", bytes.NewBuffer(payloadBytes))
	if err != nil {
		t.Fatal(err)
	}
	recorder := httptest.NewRecorder()
	handler := http.HandlerFunc(RegisterHandler)
	handler.ServeHTTP(recorder, req)

	if status := recorder.Code; status != http.StatusOK {
		t.Errorf("expected status %d, got %d", http.StatusOK, status)
	}

	dataEntry, exists := data.Users["jdoe"]
	if !exists || dataEntry.FirstName != "John" {
		t.Errorf("user was not added correctly")
	}
}

func TestRegisterUserHandler2(t *testing.T) {
	data.Users = make(map[string]user.User)

	u1 := user.User{
		UserId:    1,
		FirstName: "Jack",
		LastName:  "Doe",
		UserName:  "jdoe",
		Password:  "impossible",
	}

	data.Users[u1.UserName] = u1

	userPayload := user.UserPayload{
		FirstName: "John",
		LastName:  "Doe",
		UserName:  "jdoe",
		Password:  "anon",
	}
	payloadBytes, _ := json.Marshal(userPayload)

	req, err := http.NewRequest("POST", "/api/user/register", bytes.NewBuffer(payloadBytes))
	if err != nil {
		t.Fatal(err)
	}
	recorder := httptest.NewRecorder()
	handler := http.HandlerFunc(RegisterHandler)
	handler.ServeHTTP(recorder, req)

	if status := recorder.Code; status != http.StatusBadRequest {
		t.Errorf("expected status %d, got %d", http.StatusBadRequest, status)
	}

	dataEntry, exists := data.Users["jdoe"]
	if !exists || dataEntry.FirstName != "Jack" {
		t.Errorf("user was added which is incorrect")
	}
}

func TestGetUserHandler(t *testing.T) {
	data.Users = make(map[string]user.User)

	u1 := user.User{
		UserId:    1,
		FirstName: "Jack",
		LastName:  "Reacher",
		UserName:  "military",
		Password:  "plainandsimple",
	}

	u2 := user.User{
		UserId:    2,
		FirstName: "Tom",
		LastName:  "Jerry",
		UserName:  "tuffy",
		Password:  "spike",
	}

	data.Users[u1.UserName] = u1
	data.Users[u2.UserName] = u2

	req, err := http.NewRequest("GET", "/api/users", nil)
	if err != nil {
		t.Fatal(err)
	}

	recorder := httptest.NewRecorder()
	handler := http.HandlerFunc(GetUsersHandler)
	handler.ServeHTTP(recorder, req)

	if status := recorder.Code; status != http.StatusOK {
		t.Errorf("expected status %d, got %d", http.StatusOK, status)
	}

	resp := recorder.Result()
	body, _ := io.ReadAll(resp.Body)
	var bodyJson map[string]housing.Housing

	err = json.Unmarshal(body, &bodyJson)

	if err != nil {
		t.Errorf("user data retrived incorrectly")
	}

	_, exists := bodyJson[u1.UserName]
	if !exists {
		t.Errorf("user data missing entries")
	}

	_, exists1 := bodyJson[u2.UserName]
	if !exists1 {
		t.Errorf("user data missing entries")
	}

}

func TestLoginHandler(t *testing.T) {
	data.Users = make(map[string]user.User)

	u1 := user.User{
		UserId:    1,
		FirstName: "Jack",
		LastName:  "Reacher",
		UserName:  "military",
		Password:  "plainandsimple",
	}

	data.Users[u1.UserName] = u1

	loginPayload := user.LoginPayload{
		UserName: "military",
		Password: "plainandsimple",
	}
	payloadBytes, _ := json.Marshal(loginPayload)

	req, err := http.NewRequest("POST", "/api/user/login", bytes.NewBuffer(payloadBytes))
	if err != nil {
		t.Fatal(err)
	}
	recorder := httptest.NewRecorder()
	handler := http.HandlerFunc(LoginHandler)
	handler.ServeHTTP(recorder, req)

	if status := recorder.Code; status != http.StatusOK {
		t.Errorf("expected status %d, got %d", http.StatusOK, status)
	}
}
