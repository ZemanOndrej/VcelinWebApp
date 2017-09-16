package api

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"vcelin/server/db"
	"strconv"
	"golang.org/x/crypto/bcrypt"
	"regexp"
)

type UpdateUserModel struct {
	Username          string `form:"username" json:"username"`
	NewPassword       string `form:"newPassword" json:"newPassword"`
	RetypeNewPassword string `form:"retypeNewPassword" json:"retypeNewPassword"`
	OldPassword       string `form:"oldPassword" json:"oldPassword" binding:"required"`
	Email             string `form:"email" json:"email"`
}

func CreateUser(c *gin.Context) {
	c.JSON(http.StatusBadGateway, gin.H{})
}

func UpdateUser(c *gin.Context) {
	id := c.Params.ByName("id")
	user, err := c.Get("User")
	var updateUserModel UpdateUserModel

	if userId, ok := strconv.ParseUint(id, 10, 32); ok == nil {
		if err {
			err := c.BindJSON(&updateUserModel)
			if err == nil {

				if len(updateUserModel.OldPassword) > 0 {

					context := db.Database()
					defer context.Close()
					var foundUser db.User
					context.Find(&foundUser, userId)

					err := bcrypt.CompareHashAndPassword([]byte(foundUser.Password), []byte(updateUserModel.OldPassword))

					if err == nil {
						//admin can edit users info
						if foundUser.ID == user.(db.User).ID || user.(db.User).ID == 1 {

							if len(updateUserModel.NewPassword) > 6 && updateUserModel.NewPassword == updateUserModel.RetypeNewPassword {
								hashedNew, _ := bcrypt.GenerateFromPassword([]byte(updateUserModel.NewPassword), bcrypt.DefaultCost)
								foundUser.Password = string(hashedNew[:])

							}
							if match, _ := regexp.MatchString(`(.+)@(.+)\.(.+)`, updateUserModel.Email); match {
								foundUser.Email = updateUserModel.Email
							} else {
								c.JSON(http.StatusBadRequest, gin.H{"message": "User was not updated, incorrect email address!"})
								return
							}
							if len(updateUserModel.Username) > 0 {
								foundUser.Name = updateUserModel.Username
							}
							context.Save(&foundUser)
							c.JSON(http.StatusCreated, gin.H{"message": "User updated successfully!", "id": foundUser.ID})

						} else {
							c.JSON(http.StatusUnauthorized, gin.H{"message": "User was not updated, you cant edit others users!"})
						}
					} else {
						c.JSON(http.StatusUnauthorized, gin.H{"message": "User was not updated, your given old password is incorrect!"})
					}

				} else {
					c.JSON(http.StatusBadRequest, gin.H{"message": "User was not updated, given information are bad!"})
				}
			} else {
				c.JSON(http.StatusBadRequest, gin.H{"message": "User was not updated, Could not bind model!"})
			}

		} else {
			c.JSON(http.StatusBadRequest, gin.H{"message": "User was not updated. Couldnt find user"})
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{})

	}
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
				c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "message": "Comment deleted successfully!"})
			} else {
				c.JSON(http.StatusUnauthorized, gin.H{"message": "you cannot delete this user"})

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
	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "data": users})

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

			c.JSON(http.StatusOK, gin.H{"User": User})
		} else {
			c.JSON(http.StatusBadRequest, gin.H{})
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{})

	}

}
