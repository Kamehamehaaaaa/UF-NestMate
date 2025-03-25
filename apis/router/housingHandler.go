package router

import (
	"apis/data"
	"apis/database"
	"apis/housing"
	"encoding/json"
	"io"
	"net/http"
	"context"
	"log"
	"go.mongodb.org/mongo-driver/bson"
	
	
	
	
)



func GetHousingHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Ensure MongoDB connection is established
	database.ConnectToMongoDB()
	defer database.CloseMongoDBConnection()

	log.Println("Connected to MongoDB!")

	// Fetch data from MongoDB
	var housings []housing.Housing
	cursor, err := database.GetHousingCollection().Find(context.TODO(), bson.M{})
	if err != nil {
		http.Error(w, "Error fetching data", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.TODO())

	for cursor.Next(context.TODO()) {
		var housing housing.Housing
		err := cursor.Decode(&housing)
		if err != nil {
			log.Printf("Error decoding document: %v\n", err)
			continue
		}
		housings = append(housings, housing)
	}

	if len(housings) == 0 {
		http.Error(w, "No data found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(housings)
	if err != nil {
		http.Error(w, "Error encoding data to JSON", http.StatusInternalServerError)
		return
	}
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
