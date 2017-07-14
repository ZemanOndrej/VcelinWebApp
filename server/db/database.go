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
	context.DropTableIfExists(&User{})
	context.DropTableIfExists(&Post{})
	context.DropTableIfExists(&Comment{})
	context.DropTableIfExists(&Image{})
	context.DropTableIfExists(&Article{})
	context.CreateTable(&User{})
	context.CreateTable(&Post{})
	context.CreateTable(&Comment{})
	context.CreateTable(&Image{})
	context.CreateTable(&Article{})

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

	article := Article{
		User:user,
		Title:"first Article",
		Text:"Lorem ipsum dolor sit amet, mei ex tantas accumsan corrumpit. Mel ad detraxit urbanitas pertinacia, nam habemus oporteat instructior ut. Id eam integre conceptam interesset, nisl graece epicuri id eos. No veri consequat democritum sed, ridens discere no sea, an qui detracto interpretaris. Nam illum luptatum ad, et etiam mandamus repudiandae sit, veri falli adolescens in his.",


	}
	context.Create(&article)
	image := Image{
		Name:"firstImageName",
		Article:article,
		FileName:"firstImage.png",

	}
	context.Create(&image)

}

func Database() *gorm.DB {
	db, err := gorm.Open("mysql", "root:adminmysqlpassword@tcp(localhost:3306)/vcelin?charset=utf8&parseTime=True&loc=Local")
	if err != nil {
		fmt.Printf("Error connecting to DB: <%s> \n", err)

		panic(fmt.Errorf("failed to connect database with error  <%s> \n", err))
	}
	return db

}
