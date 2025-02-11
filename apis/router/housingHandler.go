package router

import (
	"apis/data"
	"apis/housing"
	"encoding/json"
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

	id := r.FormValue("HousingID")
	name := r.FormValue("HousingName")
	location := r.FormValue("Location")
	vacancy, err := strconv.Atoi(r.FormValue("vacancy"))

	if err != nil {
		response := "Invalid entry for vacancy"
		http.Error(w, response, http.StatusBadRequest)
	}

	data.Housings[id] = housing.Housing{ID: id, Name: name, Location: location, Vacancy: vacancy}
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

		data.Housings[id] = housing.Housing{ID: id, Name: name, Location: location, Vacancy: vacancy}
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
