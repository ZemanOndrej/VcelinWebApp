package api

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"vcelin/server/db"
	"strconv"
)

func PostUser(c *gin.Context) {

}

func GetUser(c *gin.Context) {
	id := c.Params.ByName("id")
	var User db.User

	if userId, ok := strconv.ParseUint(id, 10, 32); ok == nil {
		if len(User.Email) > 0 {
			User.ID = uint(userId)
			context := db.Database()
			context.Find(&User)
			c.JSON(http.StatusOK, gin.H{"Comment" : User})
		} else {
			c.JSON(http.StatusBadRequest, gin.H{})
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{})

	}

}

func UpdateUser(c *gin.Context) {

}

func GetUsers(c *gin.Context) {
	var users [] db.User

	context := db.Database()
	context.Find(&users)
	context.Close()

	if (len(users) <= 0) {
		c.JSON(http.StatusNotFound, gin.H{"status" : http.StatusNotFound, "message" : "No users found!"})
	}

	c.JSON(http.StatusOK, gin.H{"status" : http.StatusOK, "data" : users})

}

func DeleteUser(c *gin.Context) {

	id := c.Params.ByName("id")
	var User db.User

	if userId, ok := strconv.ParseUint(id, 10, 32); ok == nil {
		if userId > 0 {
			User.ID = uint(userId)
			context := db.Database()
			context.Delete(&User)
			c.JSON(http.StatusOK, gin.H{"status" : http.StatusOK, "message" : "Comment deleted successfully!"})

		} else {
			c.JSON(http.StatusBadRequest, gin.H{})

		}

	} else {
		c.JSON(http.StatusBadRequest, gin.H{})
	}
}




