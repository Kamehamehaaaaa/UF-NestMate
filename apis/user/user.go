package user

type UserPayload struct {
	FirstName   string       `json:"firstname"`
	LastName    string       `json:"lastname"`
	UserName    string       `json:"username"`
	Password    string       `json:"password"`
	Email       string       `json:"email"`
	Favorites   []int        `json:"favorites" bson:"favorites"`
	Preferences *Preferences `json:"preferences,omitempty" bson:"preferences,omitempty"`
}

type LoginPayload struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type User struct {
	Username    string       `json:"username" bson:"username"`
	Password    string       `json:"password" bson:"password"`
	FirstName   string       `json:"firstName" bson:"firstName"`
	LastName    string       `json:"lastName" bson:"lastName"`
	Favorites   []int        `json:"favorites" bson:"favorites"`
	Preferences *Preferences `json:"preferences,omitempty" bson:"preferences,omitempty"`
}

type Preferences struct {
	Budget           Budget `json:"budget" bson:"budget"`
	Major            string `json:"major" bson:"major"`
	Hobbies          string `json:"hobbies" bson:"hobbies"`
	Food             string `json:"food" bson:"food"`
	SleepingHabit    string `json:"sleeping_habit" bson:"sleeping_habit"`
	SmokingDrinking  string `json:"smoking" bson:"smoking"`
	Cleanliness      int    `json:"cleanliness" bson:"cleanliness"`
	GenderPreference string `json:"gender_preference" bson:"gender_preference"`
	PetPreference    string `json:"pet_preference" bson:"pet_preference"`
}

type Budget struct {
	Min int `json:"min" bson:"min"`
	Max int `json:"max" bson:"max"`
}
