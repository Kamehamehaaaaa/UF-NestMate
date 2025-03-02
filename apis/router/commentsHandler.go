package router

import (
	"apis/comments"
	"apis/data"
	"encoding/json"
	"io"
	"net/http"
	"time"
)

func addCommentHandler(w http.ResponseWriter, r *http.Request) {
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

	var commentPayload comments.CommentsPayload
	err = json.Unmarshal(body, &commentPayload)
	if err != nil {
		http.Error(w, "Error unmarshalling JSON", http.StatusBadRequest)
		return
	}

	data.Comments[commentPayload.ID] = comments.Comments{ID: commentPayload.ID,
		HousingID: commentPayload.HousingID,
		Comment:   commentPayload.Comment,
		Rating:    commentPayload.Rating,
		Timestamp: time.Now()}
}

func deleteCommentHandler(w http.ResponseWriter, r *http.Request) {
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

	var commentPayload comments.CommentsPayload
	err = json.Unmarshal(body, &commentPayload)
	if err != nil {
		http.Error(w, "Error unmarshalling JSON", http.StatusBadRequest)
		return
	}

	_, exists := data.Comments[commentPayload.ID]

	if !exists {
		http.Error(w, "Comment doesnt exist", http.StatusBadRequest)
	} else {
		delete(data.Comments, commentPayload.ID)
		w.WriteHeader(http.StatusOK)
	}
}

func getCommentHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	var commentPayload comments.CommentsPayload
	err = json.Unmarshal(body, &commentPayload)
	if err != nil {
		http.Error(w, "Error unmarshalling JSON", http.StatusBadRequest)
		return
	}

	if commentPayload.HousingID != "" {
		var commentsForHousing = getAllCommentsForHousing(commentPayload.HousingID)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(commentsForHousing)
		w.WriteHeader(http.StatusOK)
	} else if commentPayload.ID != "" {
		data, exists := data.Comments[commentPayload.ID]

		if !exists {
			http.Error(w, "Comment doesnt exist", http.StatusBadRequest)
		} else {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(data)
			w.WriteHeader(http.StatusOK)
		}
	} else {
		http.Error(w, "Invalid Request", http.StatusBadRequest)
	}
}

func getAllCommentsForHousing(housingId string) map[string]comments.Comments {
	var comments = make(map[string]comments.Comments)
	for key, value := range data.Comments {
		if value.HousingID == housingId {
			comments[key] = value
		}
	}
	return comments
}
