package db

import (
	"github.com/jinzhu/gorm"
)

const PageSize = 15
const ImagesURI = "./server/images/"
const ImagesTmpURI = "./server/tmp/"

type User struct {
	gorm.Model
	Name     string `gorm:"not null;type:varchar(128)" form:"name" json:"name"`
	Password string `gorm:"not null;type:varchar(128)" form:"password" json:"password"`
	Email    string `gorm:"not null;type:varchar(128)" form:"email" json:"email" sql:"unique"`
	Posts    []Post `gorm:"ForeignKey:UserId"`
	Comments []Comment `gorm:"ForeignKey:UserId"`
}
type Comment struct {
	gorm.Model
	Message string `gorm:"not null;type:varchar(1000)" form:"message" json:"message"`
	User    User `gorm:"ForeignKey:UserId"`
	UserId  uint `gorm:"not null"`
	Post    Post `gorm:"ForeignKey:PostId"`
	PostId  uint `gorm:"not null"`
}

type Post struct {
	gorm.Model
	Message      string `gorm:"not null;type:varchar(1000)" form:"message" json:"message"`
	User         User `gorm:"ForeignKey:UserId"`
	UserId       uint `gorm:"not null"`
	Comments     []Comment `gorm:"ForeignKey:PostId"`
	CommentCount uint `gorm:"not null" json:"commentCount"`
}

type Article struct {
	gorm.Model
	Title  string `gorm:"not null;type:varchar(100)" form:"title" json:"title"`
	Text   string `gorm:"type:varchar(2000)" form:"text" json:"text" `
	User   User `gorm:"ForeignKey:UserId"`
	UserId uint `gorm:"not null"`
	Images []Image `gorm:"ForeignKey:ArticleId"`
}

type Image struct {
	gorm.Model
	Name      string `gorm:"not null" form:"name" json:"name"`
	Article   Article `gorm:"ForeignKey:ArticleId"`
	ArticleId uint `gorm:"not null"`
	Filename  string `sql:"not null;unique" json:"filename"`
	Position  uint `sql:"not null;" json:"position"`
}