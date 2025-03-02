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
	ID          string  `json:"housingId" validate:"required,min=2"`
	Name        string  `json:"propertyName" validate:"required,min=2,max=30"`
	Address     string  `json:"address" validate:"required,max=50"`
	Vacancy     int     `json:"vacancy"`
	Rating      float64 `json:"rating" validate:"omitempty,max=5"`
	Description string  `json:"description"`
}
