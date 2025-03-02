package user

type User struct {
	FirstName string
	LastName  string
	UserName  string
	Password  string
}

type UserPayload struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	UserName  string `json:"username"`
	Password  string `json:"password"`
}

type LoginPayload struct {
	UserName string `json:"username"`
	Password string `json:"password"`
}
