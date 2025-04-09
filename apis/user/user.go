package user

type UserPayload struct {
	FirstName string `json:"firstname"`
	LastName  string `json:"lastname"`
	UserName  string `json:"username"`
	Password  string `json:"password"`
	Email     string `json:"email"`
}

type LoginPayload struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type User struct {
	Username  string `json:"username" bson:"username"`
	Password  string `json:"password" bson:"password"`
	FirstName string `json:"firstName" bson:"firstName"`
	LastName  string `json:"lastName" bson:"lastName"`
	Favorites []int  `json:"favorites" bson:"favorites"`
}
// type User struct {
// 	UserId    int64  `json:"userId"`
// 	FirstName string `json:"firstName"`
// 	LastName  string `json:"lastName"`
// 	UserName  string `json:"username"`
// 	Password  string `json:"password"`
// 	Email     string `json:"email"`
// }
