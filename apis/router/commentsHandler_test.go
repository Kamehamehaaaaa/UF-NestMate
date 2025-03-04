package router

import (
	"apis/comments"
	"apis/data"
	"apis/housing"
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestAddCommentHandler(t *testing.T) {
	data.Housings = make(map[string]housing.Housing)

	h1 := housing.Housing{
		ID:          "1",
		Name:        "Apartment1",
		Address:     "Address1",
		Vacancy:     100,
		Rating:      4.3,
		Description: "A nice place to stay.",
	}

	data.Housings["1"] = h1

	commentPayload := comments.CommentsPayload{
		ID:        "1001",
		HousingID: "1",
		Comment:   "Great space to live",
		Rating:    5.0,
	}
	payloadBytes, _ := json.Marshal(commentPayload)

	req, err := http.NewRequest("POST", "/api/comment/add", bytes.NewBuffer(payloadBytes))
	if err != nil {
		t.Fatal(err)
	}
	recorder := httptest.NewRecorder()
	handler := http.HandlerFunc(addCommentHandler)
	handler.ServeHTTP(recorder, req)

	if status := recorder.Code; status != http.StatusOK {
		t.Errorf("expected status %d, got %d", http.StatusOK, status)
	}

	dataEntry, exists := data.Comments["1001"]
	if !exists || dataEntry.HousingID != "1" || dataEntry.Comment != "Great space to live" {
		t.Errorf("comment was not added correctly")
	}
}

func TestGetCommentHandler(t *testing.T) {
	data.Housings = make(map[string]housing.Housing)

	h1 := housing.Housing{
		ID:          "1",
		Name:        "Apartment1",
		Address:     "Address1",
		Vacancy:     100,
		Rating:      4.3,
		Description: "A nice place to stay.",
	}

	data.Housings["1"] = h1

	data.Comments = make(map[string]comments.Comments)

	c1 := comments.Comments{
		ID:        "1001",
		HousingID: "1",
		Comment:   "Great place to live",
		Rating:    5.0,
	}

	c2 := comments.Comments{
		ID:        "1002",
		HousingID: "1",
		Comment:   "Suburban vibes",
		Rating:    4.5,
	}

	data.Comments["1001"] = c1
	data.Comments["1002"] = c2

	commentPayload := comments.CommentsPayload{
		HousingID: "1",
	}
	payloadBytes, _ := json.Marshal(commentPayload)

	req, err := http.NewRequest("GET", "/api/comments/get", bytes.NewBuffer(payloadBytes))
	if err != nil {
		t.Fatal(err)
	}

	recorder := httptest.NewRecorder()
	handler := http.HandlerFunc(getCommentHandler)
	handler.ServeHTTP(recorder, req)

	if status := recorder.Code; status != http.StatusOK {
		t.Errorf("expected status %d, got %d", http.StatusOK, status)
	}

	resp := recorder.Result()
	body, _ := io.ReadAll(resp.Body)
	var bodyJson map[string]housing.Housing

	err = json.Unmarshal(body, &bodyJson)

	if err != nil {
		t.Errorf("housing data retrived correctly")
	}

	_, exists := bodyJson["1001"]
	if !exists {
		t.Errorf("comment %d doesnt exist", 1001)
	}

	_, exists1 := bodyJson["1002"]
	if !exists1 {
		t.Errorf("comment %d doesnt exist", 1001)
	}

}

func TestDeleteCommentHandler(t *testing.T) {
	data.Housings = make(map[string]housing.Housing)

	h1 := housing.Housing{
		ID:          "1",
		Name:        "Apartment1",
		Address:     "Address1",
		Vacancy:     100,
		Rating:      4.3,
		Description: "A nice place to stay.",
	}

	data.Housings["1"] = h1

	data.Comments = make(map[string]comments.Comments)

	c1 := comments.Comments{
		ID:        "1001",
		HousingID: "1",
		Comment:   "New place",
		Rating:    4.0,
	}

	data.Comments["1001"] = c1

	commentPayload := comments.CommentsPayload{
		ID: "1001",
	}
	payloadBytes, _ := json.Marshal(commentPayload)

	req, err := http.NewRequest("DELETE", "/api/housing/delete", bytes.NewBuffer(payloadBytes))
	if err != nil {
		t.Fatal(err)
	}
	recorder := httptest.NewRecorder()
	handler := http.HandlerFunc(deleteCommentHandler)
	handler.ServeHTTP(recorder, req)

	if status := recorder.Code; status != http.StatusOK {
		t.Errorf("expected status %d, got %d", http.StatusOK, status)
	}

	_, exists := data.Comments["1001"]
	if exists {
		t.Errorf("comment was not deleted.")
	}
}
