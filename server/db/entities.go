package db

import (
	"github.com/jinzhu/gorm"
)

type User struct {
	gorm.Model
	Name string `gorm:"not null" form:"name" json:"name"`
	Password  string `gorm:"not null" form:"password" json:"password"`
	Email string `gorm:"not null" form:"email" json:"email" sql:"unique"`
	Posts []Post `gorm:"ForeignKey:UserId"`
	Comments []Comment `gorm:"ForeignKey:UserId"`

}
type Comment struct {
	gorm.Model
	Message string `gorm:"not null" form:"message" json:"message"`
	User User `gorm:"ForeignKey:UserId"`
	UserId uint `gorm:"not null"`
	Post Post `gorm:"ForeignKey:PostId"`
	PostId uint `gorm:"not null"`
}

type Post struct {
	gorm.Model
	Message string `gorm:"not null" form:"message" json:"message"`
	User User `gorm:"ForeignKey:UserId"`
	UserId uint `gorm:"not null"`
	Comments []Comment `gorm:"ForeignKey:PostId"`
}