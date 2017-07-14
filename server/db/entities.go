package db

import (
	"github.com/jinzhu/gorm"
)

const PageSize = 15
const ImagesURI = "./server/images"

type User struct {
	gorm.Model
	Name     string `gorm:"not null" form:"name" json:"name"`
	Password string `gorm:"not null" form:"password" json:"password"`
	Email    string `gorm:"not null" form:"email" json:"email" sql:"unique"`
	Posts    []Post `gorm:"ForeignKey:UserId"`
	Comments []Comment `gorm:"ForeignKey:UserId"`
}
type Comment struct {
	gorm.Model
	Message string `gorm:"not null" form:"message" json:"message"`
	User    User `gorm:"ForeignKey:UserId"`
	UserId  uint `gorm:"not null"`
	Post    Post `gorm:"ForeignKey:PostId"`
	PostId  uint `gorm:"not null"`
}

type Post struct {
	gorm.Model
	Message  string `gorm:"not null" form:"message" json:"message"`
	User     User `gorm:"ForeignKey:UserId"`
	UserId   uint `gorm:"not null"`
	Comments []Comment `gorm:"ForeignKey:PostId"`
}

type Article struct {
	gorm.Model
	Title  string `gorm:"not null" form:"title" json:"title"`
	Text   string `gorm:"not null;type:varchar(400)" form:"text" json:"text" `
	User   User `gorm:"ForeignKey:UserId"`
	UserId uint `gorm:"not null"`
	Images []Image `gorm:"ForeignKey:ArticleId"`
}

type Image struct {
	gorm.Model
	Name      string `gorm:"not null" form:"name" json:"name"`
	Article   Article `gorm:"ForeignKey:ArticleId"`
	ArticleId uint `gorm:"not null"`
	FileName  string `gorm:"not null"`
}