package comments

type Comments struct {
	ApartmentID int    `json:"apartmentId"`
	Comment     string `json:"comment"`
}

type CommentsPayload struct {
	ID        string  `json:"commentID"`
	HousingID string  `json:"housingID"`
	Comment   string  `json:"comment"`
	Rating    float64 `json:"rating"`
}
