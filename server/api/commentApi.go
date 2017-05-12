package api

import (
	"net/http"
	"vcelin/server/db"
	"github.com/gin-gonic/gin"
	"strconv"
)

type CommentModel struct {
	Message string `json:"message" binding:"required"`
	PostId  string`json:"postId" binding:"required"`
}

type UpdateCommentModel struct {
	Message string `json:"message" binding:"required"`
}

func CreateComment(c *gin.Context) {
	user, err := c.Get("User")
	var CommentModel CommentModel

	if err {
		if c.Bind(&CommentModel) == nil {

			if s, ok := strconv.ParseUint(CommentModel.PostId, 10, 32); ok == nil {
				if len(CommentModel.Message) > 0 &&s > 0 {

					context := db.Database()
					defer context.Close()
					post := db.Post{}
					post.ID = uint(s)
					context.Find(&post)

					Comment := db.Comment{Message: CommentModel.Message, User:user.(db.User), Post:post};
					context.Create(&Comment)
					Comment.User.Email = ""
					Comment.User.Password = ""
					c.JSON(http.StatusCreated, gin.H{"message" : "Comment item created successfully!", "comment": Comment})
				} else {
					c.JSON(http.StatusBadRequest, gin.H{"message" : "Comment was not created, Comment message is empty"})

				}
			} else {
				c.JSON(http.StatusBadRequest, gin.H{"message" : "Comment was not created PostId is not valid"})

			}

		} else {
			c.JSON(http.StatusBadRequest, gin.H{"message" : "Comment was not created"})
		}

	} else {
		c.JSON(http.StatusBadRequest, gin.H{"message" : "Comment was not created. Couldnt find user"})
	}

}

func FetchCommentsForPost(c *gin.Context) {

	id := c.Params.ByName("id")
	var Comments [] db.Comment

	if postId, ok := strconv.ParseUint(id, 10, 32); ok == nil {

		context := db.Database()
		defer context.Close()
		context.Where("post_id = ?", postId).Order("created_at desc").Preload("User").Find(&Comments)

		context.Close()

		c.JSON(http.StatusOK, gin.H{"status" : http.StatusOK, "data" : Comments, "postId":postId})
	}

}

func FetchAllComments(c *gin.Context) {

	var Comments [] db.Comment

	context := db.Database()
	defer context.Close()

	context.Order("created_at desc").Find(&Comments)

	c.JSON(http.StatusOK, gin.H{"status" : http.StatusOK, "data" : Comments})
}

func FetchSingleComment(c *gin.Context) {
	id := c.Params.ByName("id")
	var Comment db.Comment

	if commentId, ok := strconv.ParseUint(id, 10, 32); ok == nil {
		Comment.ID = uint(commentId)
		context := db.Database()
		defer context.Close()
		context.Find(&Comment)
		c.JSON(http.StatusOK, gin.H{"Comment" : Comment})
	} else {
		c.JSON(http.StatusBadRequest, gin.H{})
	}
}

func UpdateComment(c *gin.Context) {
	id := c.Params.ByName("id")
	user, okUser := c.Get("User")
	var commentModel UpdateCommentModel

	if commentId, ok := strconv.ParseUint(id, 10, 32); ok == nil {
		if okUser {
			if c.Bind(&commentModel) == nil {
				if len(commentModel.Message) > 0 {

					context := db.Database()
					defer context.Close()
					var foundComment db.Comment
					foundComment.ID = uint(commentId)
					context.Find(&foundComment)
					//admin comment edit with admin id 1
					if foundComment.UserId == user.(db.User).ID || user.(db.User).ID == 1 {
						foundComment.Message = commentModel.Message
						context.Save(&foundComment)
						c.JSON(http.StatusCreated, gin.H{"message" : "Comment updated successfully!", "id": foundComment.ID})

					} else {
						c.JSON(http.StatusUnauthorized, gin.H{"message" : "Comment was not updated, you cant edit others comment"})
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
	user, okUser := c.Get("User")

	if commentId, ok := strconv.ParseUint(id, 10, 32); ok == nil {

		if okUser && commentId > 0 {

			Comment.ID = uint(commentId)
			context := db.Database()
			defer context.Close()
			context.Find(&Comment)
			//admin user id is 1 he can delete what he wants
			if user.(db.User).ID == Comment.UserId || user.(db.User).ID == 1 {
				context.Delete(&Comment)
				c.JSON(http.StatusOK, gin.H{"status" : http.StatusOK, "message" : "Comment deleted successfully!"})
			} else {
				c.JSON(http.StatusUnauthorized, gin.H{"message":"You cannot delete this comment"})
			}
		} else {
			c.JSON(http.StatusBadRequest, gin.H{})

		}

	} else {
		c.JSON(http.StatusBadRequest, gin.H{})
	}

}