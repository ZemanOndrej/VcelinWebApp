package api

import (
	"net/http"
	"vcelin/server/db"
	"github.com/gin-gonic/gin"
	"strconv"
)

type CommentModel struct {
	Message string `json:"message" binding:"required"`
	PostId  uint `json:"postId" binding:"required"`
}

func CreateComment(c *gin.Context) {
	user, err := c.Get("User")
	var CommentModel CommentModel

	if err {
		if c.Bind(&CommentModel) == nil {
			if len(CommentModel.Message) > 0 {

				context := db.Database()
				defer context.Close()
				post := db.Post{}
				post.ID = CommentModel.PostId
				context.Find(&post)

				Comment := db.Comment{Message: CommentModel.Message, User:user.(db.User), Post:post};
				context.Create(&Comment)
				c.JSON(http.StatusCreated, gin.H{"message" : "Comment item created successfully!", "id": Comment.ID})
			} else {
				c.JSON(http.StatusBadRequest, gin.H{"message" : "Comment was not created, Comment message is empty"})

			}

		} else {
			c.JSON(http.StatusBadRequest, gin.H{"message" : "Comment was not created"})
		}

	} else {
		c.JSON(http.StatusBadRequest, gin.H{"message" : "Comment was not created. Couldnt find user"})
	}

}

func FetchAllComments(c *gin.Context) {

	var Comments [] db.Comment

	context := db.Database()
	context.Find(&Comments)
	context.Close()

	if (len(Comments) <= 0) {
		c.JSON(http.StatusNotFound, gin.H{"status" : http.StatusNotFound, "message" : "No Comments found!"})
	}

	c.JSON(http.StatusOK, gin.H{"status" : http.StatusOK, "data" : Comments})
}

func FetchSingleComment(c *gin.Context) {
	id := c.Params.ByName("id")
	var Comment db.Comment

	if userId, ok := strconv.ParseUint(id, 10, 32); ok == nil {
		if len(Comment.Message) > 0 {
			Comment.ID = uint(userId)
			context := db.Database()
			context.Find(&Comment)
			c.JSON(http.StatusOK, gin.H{"Comment" : Comment})
		} else {
			c.JSON(http.StatusBadRequest, gin.H{})
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{})
	}
}

func UpdateComment(c *gin.Context) {
	id := c.Params.ByName("id")
	user, err := c.Get("User")
	var commentModel PostModel

	if commentId, ok := strconv.ParseUint(id, 10, 32); ok == nil {
		if err {
			if c.Bind(&commentModel) == nil {
				if len(commentModel.Message) > 0 {

					context := db.Database()
					defer context.Close()
					var foundComment db.Comment
					foundComment.ID = uint(commentId)
					context.Find(&foundComment)
					if foundComment.UserId == user.(db.User).ID {
						foundComment.Message = commentModel.Message
						context.Save(&foundComment)
						c.JSON(http.StatusCreated, gin.H{"message" : "Comment updated successfully!", "id": foundComment.ID})

					} else {
						c.JSON(http.StatusBadRequest, gin.H{"message" : "Comment was not updated, you cant edit others comment"})
					}

				} else {
					c.JSON(http.StatusBadRequest, gin.H{"message" : "Comment was not updated, Comment message is empty"})

				}

			} else {
				c.JSON(http.StatusBadRequest, gin.H{"message" : "Comment was not updated"})
			}

		} else {
			c.JSON(http.StatusBadRequest, gin.H{"message" : "Comment was not created. Couldnt find user"})
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{})

	}

}

func DeleteComment(c *gin.Context) {
	id := c.Params.ByName("id")
	var Comment db.Comment

	if commentId, ok := strconv.ParseUint(id, 10, 32); ok == nil {
		if commentId > 0 {
			Comment.ID = uint(commentId)
			context := db.Database()
			context.Delete(&Comment)
			c.JSON(http.StatusOK, gin.H{"status" : http.StatusOK, "message" : "Comment deleted successfully!"})

		} else {
			c.JSON(http.StatusBadRequest, gin.H{})

		}

	} else {
		c.JSON(http.StatusBadRequest, gin.H{})
	}

}