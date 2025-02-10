package data

import (
	"apis/housing"
	"apis/user"
)

var (
	Users    = make(map[string]user.User)
	Housings = make(map[string]housing.Housing)
)
