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
	Lat         float64  `json:"lat" bson:"lat"`      
    Lng         float64  `json:"lng" bson:"lng"` 
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
	Lat         float64  `json:"lat" bson:"lat"`       
    Lng         float64  `json:"lng" bson:"lng"` 
}
