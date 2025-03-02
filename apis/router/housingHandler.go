package router

import (
	"apis/data"
	"apis/housing"
	"encoding/json"
	"io"
	"net/http"
	"strconv"
)

func GetHousingHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data.Housings)
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

	_, exists := data.Housings[r.FormValue("HousingID")]

	if exists {
		id := r.FormValue("HousingID")
		name := r.FormValue("HousingName")
		location := r.FormValue("Location")
		vacancy, err := strconv.Atoi(r.FormValue("vacancy"))

		if err != nil {
			response := "Invalid entry for vacancy"
			http.Error(w, response, http.StatusBadRequest)
		}

		data.Housings[id] = housing.Housing{ID: id, Name: name, Address: location, Vacancy: vacancy}
	} else {
		http.Error(w, "Housing property not registered", http.StatusBadRequest)
	}
}

func DeleteHousingHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	_, exists := data.Housings[r.FormValue("HousingID")]

	if !exists {
		http.Error(w, "Housing property not registered", http.StatusBadRequest)
	} else {
		delete(data.Housings, r.FormValue("HousingID"))
		w.WriteHeader(http.StatusOK)
	}
}
