package user

type UserPayload struct {
	FirstName string `json:"firstname"`
	LastName  string `json:"lastname"`
	UserName  string `json:"username"`
	Password  string `json:"password"`
	Email     string `json:"email"`
}


type LoginPayload struct {
	UserName string `json:"username"`
	Password string `json:"password"`
}


type User struct {
	UserId    int64  `json:"userId"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	UserName  string `json:"username"`
	Password  string `json:"password"`
	Email     string `json:"email"`
}
