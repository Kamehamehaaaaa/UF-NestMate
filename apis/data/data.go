package data

import (
	"apis/comments"
	"apis/housing"
	"apis/user"
)

var (
	Users    = make(map[string]user.User)
	Housings = make(map[string]housing.Housing)
	Comments = make(map[string]comments.Comments)
)
