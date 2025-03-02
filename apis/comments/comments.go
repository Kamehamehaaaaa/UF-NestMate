package comments

import "time"

type Comments struct {
	ID        string
	HousingID string
	Comment   string
	Rating    float64
	Timestamp time.Time
}

type CommentsPayload struct {
	ID        string  `json:"commentID"`
	HousingID string  `json:"housingID"`
	Comment   string  `json:"comment"`
	Rating    float64 `json:"rating"`
}
