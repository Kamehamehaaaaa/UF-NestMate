package housing

type Housing struct {
	ID          string
	Name        string
	Address     string
	Vacancy     int
	Rating      float64
	Description string
}

type HousingPayload struct {
	ID          string  `json:"housingId"`
	Name        string  `json:"propertyName"`
	Address     string  `json:"address"`
	Vacancy     int     `json:"vacancy"`
	Rating      float64 `json:"rating"`
	Description string  `json:"description"`
}
