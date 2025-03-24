package router

import (
	"apis/data"
	"apis/housing"
	"encoding/json"
	"io"
	"net/http"
)


// Dummy data for housing
var dummyHousingData = []housing.Housing{
	{
		ID:          "1",
		Name:        "Stoneridge Apartments",
		Address:     "123 Main St",
		Vacancy:     10,
		Rating:      4.5,
		Description: "Great place to live!",
	},
	{
		ID:          "2",
		Name:        "BLVD",
		Address:     "456 Elm St",
		Vacancy:     5,
		Rating:      4.2,
		Description: "Modern and spacious.",
	},
	{
		ID:          "3",
		Name:        "Centric",
		Address:     "789 Oak St",
		Vacancy:     3,
		Rating:      4.8,
		Description: "Luxurious living space.",
	},
	{
		ID:          "4",
		Name:        "Sweetwater",
		Address:     "101 Pine St",
		Vacancy:     7,
		Rating:      4.3,
		Description: "Cozy and affordable.",
	},
}

func GetHousingHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(dummyHousingData)
	w.WriteHeader(http.StatusOK)
}

func AddHousingHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	var housingPayload housing.HousingPayload
	err = json.Unmarshal(body, &housingPayload)
	if err != nil {
		http.Error(w, "Error unmarshalling JSON", http.StatusBadRequest)
		return
	}

	if housingPayload.Vacancy < 0 {
		http.Error(w, "Invalid vacancy count", http.StatusBadRequest)
		return
	}

	data.Housings[housingPayload.ID] = housing.Housing{ID: housingPayload.ID,
		Name:        housingPayload.Name,
		Address:     housingPayload.Address,
		Vacancy:     housingPayload.Vacancy,
		Rating:      housingPayload.Rating,
		Description: housingPayload.Description}
}

func UpdateHousingHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	var housingPayload housing.HousingPayload
	err = json.Unmarshal(body, &housingPayload)
	if err != nil {
		http.Error(w, "Error unmarshalling JSON", http.StatusBadRequest)
		return
	}

	_, exists := data.Housings[housingPayload.ID]

	if exists {
		id := housingPayload.ID
		name := housingPayload.Name
		location := housingPayload.Address
		vacancy := housingPayload.Vacancy
		rating := housingPayload.Rating

		data.Housings[id] = housing.Housing{ID: id, Name: name, Address: location, Vacancy: vacancy, Rating: rating}
	} else {
		http.Error(w, "Housing property not registered", http.StatusBadRequest)
	}
}

func DeleteHousingHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	var housingPayload housing.HousingPayload
	err = json.Unmarshal(body, &housingPayload)
	if err != nil {
		http.Error(w, "Error unmarshalling JSON", http.StatusBadRequest)
		return
	}

	_, exists := data.Housings[housingPayload.ID]

	if !exists {
		http.Error(w, "Housing property not registered", http.StatusBadRequest)
	} else {
		delete(data.Housings, housingPayload.ID)
		w.WriteHeader(http.StatusOK)
	}
}
