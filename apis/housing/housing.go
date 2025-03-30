package housing

type Housing struct {
	ID          int      `json:"id" bson:"id"`
	Name        string   `json:"name" bson:"name"`
	Image       string   `json:"image" bson:"image"`
	Description string   `json:"description" bson:"description"`
	Address     string   `json:"address" bson:"address"`
	Vacancy     int      `json:"vacancy" bson:"vacancy"`
	Rating      float64  `json:"rating" bson:"rating"`
	Comments    []string `json:"comments" bson:"comments"`
}

type HousingPayload struct {
	ID          int      `json:"id" bson:"id"`
	Name        string   `json:"name" bson:"name"`
	Image       string   `json:"image" bson:"image"`
	Description string   `json:"description" bson:"description"`
	Address     string   `json:"address" bson:"address"`
	Vacancy     int      `json:"vacancy" bson:"vacancy"`
	Rating      float64  `json:"rating" bson:"rating"`
	Comments    []string `json:"comments" bson:"comments"`
}
