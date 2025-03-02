package user

type User struct {
	FirstName string
	LastName  string
	UserName  string
	Password  string
	Email     string
}

type UserPayload struct {
	FirstName string `json:"firstName" validate:"required,min=1"`
	LastName  string `json:"lastName"`
	UserName  string `json:"username" validate:"required,min=5,max=20"`
	Password  string `json:"password" validate:"required,min=8"`
	Email     string `json:"email" validate:"required,email"`
}

type LoginPayload struct {
	UserName string `json:"username"`
	Password string `json:"password"`
}
