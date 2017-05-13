package api

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"vcelin/server/db"
	"strconv"
)

func CreateUser(c *gin.Context) {
	c.JSON(http.StatusBadGateway, gin.H{})
}

func UpdateUser(c *gin.Context) {
	c.JSON(http.StatusBadGateway, gin.H{})
}

func DeleteUser(c *gin.Context) {

	id := c.Params.ByName("id")
	var wantedUser db.User
	currUser, okUser := c.Get("User")

	if userId, ok := strconv.ParseUint(id, 10, 32); ok == nil {
		if okUser && userId > 0 && userId != 1 {
			wantedUser.ID = uint(userId)
			context := db.Database()
			defer context.Close()
			context.Find(&wantedUser)
			//only admin can delete other users than himself
			if wantedUser.ID == currUser.(db.User).ID || currUser.(db.User).ID == 1 {
				context.Delete(&wantedUser)
				c.JSON(http.StatusOK, gin.H{"status" : http.StatusOK, "message" : "Comment deleted successfully!"})
			} else {
				c.JSON(http.StatusUnauthorized, gin.H{"message":"you cannot delete this user"})

			}
		} else {
			c.JSON(http.StatusBadRequest, gin.H{})

		}

	} else {
		c.JSON(http.StatusBadRequest, gin.H{})
	}
}


func GetUsers(c *gin.Context) {
	var users [] db.User

	context := db.Database()
	defer context.Close()
	context.Find(&users)
	for i := range users {
		users[i].Password = ""
		users[i].Email = ""
	}
	c.JSON(http.StatusOK, gin.H{"status" : http.StatusOK, "data" : users})

}

func GetUser(c *gin.Context) {
	id := c.Params.ByName("id")
	var User db.User

	if userId, ok := strconv.ParseUint(id, 10, 32); ok == nil {
		if len(User.Email) > 0 {
			User.ID = uint(userId)
			context := db.Database()
			defer context.Close()
			context.Find(&User)
			User.Password = ""
			User.Email = ""

			c.JSON(http.StatusOK, gin.H{"User" : User})
		} else {
			c.JSON(http.StatusBadRequest, gin.H{})
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{})

	}

}



