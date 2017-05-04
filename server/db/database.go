package db

import (
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/jinzhu/gorm"
	"fmt"
	"golang.org/x/crypto/bcrypt"
)

func InitDb() {
	context := Database()
	defer context.Close()
	context.AutoMigrate(&User{})
	context.AutoMigrate(&Post{})
	context.AutoMigrate(&Comment{})
	context.DropTableIfExists(&User{})
	context.DropTableIfExists(&Post{})
	context.DropTableIfExists(&Comment{})
	context.CreateTable(&User{})
	context.CreateTable(&Post{})
	context.CreateTable(&Comment{})

	hashedPw, _ := bcrypt.GenerateFromPassword([]byte("password"), bcrypt.DefaultCost)
	user := User{
		Email:"admin@q.q",
		Name: "admin",
		Password: string(hashedPw),
	}
	context.Create(&user)

	post := Post{
		Message:"first post",
		User:user,
	}
	context.Create(&post)
	comment := Comment{
		Message:"firs comment",
		User:user,
		Post:post,
	}
	context.Create(&comment)

	user2 := User{
		Email:"adminq@q.q",
		Name: "admin",
		Password: string(hashedPw),
	}
	context.Create(&user2)

}

func Database() *gorm.DB {
	db, err := gorm.Open("mysql", "root:adminmysqlpassword@tcp(localhost:3306)/vcelin?charset=utf8&parseTime=True&loc=Local")
	if err != nil {
		fmt.Printf("Error connecting to DB: <%s> \n", err)

		panic(fmt.Errorf("failed to connect database with error  <%s> \n", err))
	}
	return db

}
