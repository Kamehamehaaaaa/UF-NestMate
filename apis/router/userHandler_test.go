package router

import (
	"apis/data"
	"apis/housing"
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestAddHousingHandler(t *testing.T) {
	data.Housings = make(map[string]housing.Housing)

	housingPayload := housing.HousingPayload{
		ID:          "1",
		Name:        "Apartment1",
		Address:     "Address",
		Vacancy:     100,
		Rating:      4.3,
		Description: "A nice place to stay.",
	}
	payloadBytes, _ := json.Marshal(housingPayload)

	req, err := http.NewRequest("POST", "/api/housing/add", bytes.NewBuffer(payloadBytes))
	if err != nil {
		t.Fatal(err)
	}
	recorder := httptest.NewRecorder()
	handler := http.HandlerFunc(AddHousingHandler)
	handler.ServeHTTP(recorder, req)

	if status := recorder.Code; status != http.StatusOK {
		t.Errorf("expected status %d, got %d", http.StatusOK, status)
	}

	dataEntry, exists := data.Housings["1"]
	if !exists || dataEntry.Name != "Apartment1" || dataEntry.Address != "Address" {
		t.Errorf("housing data was not added correctly")
	}
}

func TestGetHousingHandler(t *testing.T) {
	data.Housings = make(map[string]housing.Housing)

	h1 := housing.Housing{
		ID:          "1",
		Name:        "Apartment1",
		Address:     "Address1",
		Vacancy:     100,
		Rating:      4.3,
		Description: "A nice place to stay.",
	}

	h2 := housing.Housing{
		ID:          "2",
		Name:        "Apartment2",
		Address:     "Address2",
		Vacancy:     50,
		Rating:      4.8,
		Description: "A very nice place to stay.",
	}

	data.Housings["1"] = h1
	data.Housings["2"] = h2

	req, err := http.NewRequest("GET", "/api/housing/get", nil)
	if err != nil {
		t.Fatal(err)
	}

	recorder := httptest.NewRecorder()
	handler := http.HandlerFunc(GetHousingHandler)
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

	_, exists := bodyJson["1"]
	if !exists {
		t.Errorf("housing data missing entries")
	}

	_, exists1 := bodyJson["2"]
	if !exists1 {
		t.Errorf("housing data missing entries")
	}

}

func TestUpdateHousingHandler(t *testing.T) {
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

	housingPayload := housing.HousingPayload{
		ID:          "1",
		Name:        "Apartment1",
		Address:     "Address",
		Vacancy:     60,
		Rating:      4.5,
		Description: "A nice place to stay.",
	}
	payloadBytes, _ := json.Marshal(housingPayload)

	req, err := http.NewRequest("PUT", "/api/housing/update", bytes.NewBuffer(payloadBytes))
	if err != nil {
		t.Fatal(err)
	}
	recorder := httptest.NewRecorder()
	handler := http.HandlerFunc(UpdateHousingHandler)
	handler.ServeHTTP(recorder, req)

	if status := recorder.Code; status != http.StatusOK {
		t.Errorf("expected status %d, got %d", http.StatusOK, status)
	}

	dataEntry, exists := data.Housings["1"]
	if !exists || dataEntry.Name != "Apartment1" || dataEntry.Rating != 4.5 || dataEntry.Vacancy != 60 {
		t.Errorf("housing data was not updated correctly")
	}
}

func TestDeleteHousingHandler(t *testing.T) {
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

	housingPayload := housing.HousingPayload{
		ID: "1",
	}
	payloadBytes, _ := json.Marshal(housingPayload)

	req, err := http.NewRequest("DELETE", "/api/housing/delete", bytes.NewBuffer(payloadBytes))
	if err != nil {
		t.Fatal(err)
	}
	recorder := httptest.NewRecorder()
	handler := http.HandlerFunc(DeleteHousingHandler)
	handler.ServeHTTP(recorder, req)

	if status := recorder.Code; status != http.StatusOK {
		t.Errorf("expected status %d, got %d", http.StatusOK, status)
	}

	_, exists := data.Housings["1"]
	if exists {
		t.Errorf("housing data was not deleted.")
	}
}
