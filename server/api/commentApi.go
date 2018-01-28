package api

import (
	"VcelinWebApp/server/db"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type CommentModel struct {
	Message string `json:"message" binding:"required"`
	PostID  string `json:"postId" binding:"required"`
}

type UpdateCommentModel struct {
	Message string `json:"message" binding:"required"`
}

type WebSocketComment struct {
	Message string
	Token   string
	PostID  uint
}

func CreateCommentWebSocket(msg []byte) db.Comment {
	context := db.Database()
	var obj WebSocketComment
	defer context.Close()
	var user db.User
	var post db.Post

	if err := json.Unmarshal(msg, &obj); err != nil {
		panic("unexpected json")
	}
	err, userID := ValidateToken(obj.Token)
	if !err || userID == 0 {
		panic("bad token")
	}

	context.Find(&post, obj.PostID)
	context.Find(&user, userID)
	if post.ID == 0 || user.ID == 0 {
		panic("invalid postID or userId")
	}

	comment := db.Comment{Message: obj.Message, User: user, Post: post}
	context.Create(&comment)
	post.CommentCount++
	context.Save(&post)
	comment.User.Password = ""
	comment.User.Email = ""
	return comment
}

func CreateComment(c *gin.Context) {
	user, err := c.Get("User")
	var commentModel CommentModel

	if err {
		if c.Bind(&commentModel) == nil {

			if s, ok := strconv.ParseUint(commentModel.PostID, 10, 32); ok == nil {
				if len(commentModel.Message) > 0 && s > 0 {

					context := db.Database()
					defer context.Close()
					post := db.Post{}
					post.ID = uint(s)
					context.Find(&post)
					if len(post.Message) > 0 {
						Comment := db.Comment{Message: commentModel.Message, User: user.(db.User), Post: post}
						context.Create(&Comment)
						post.CommentCount++
						context.Save(&post)
						Comment.User.Email = ""
						Comment.User.Password = ""
						c.JSON(http.StatusCreated, gin.H{"message": "Comment item created successfully!", "comment": Comment})
					} else {
						c.JSON(http.StatusBadRequest, gin.H{"message": "Comment was not created, Post with PostId given doesnt exist"})
					}
				} else {
					c.JSON(http.StatusBadRequest, gin.H{"message": "Comment was not created, Comment message is empty"})

				}
			} else {
				c.JSON(http.StatusBadRequest, gin.H{"message": "Comment was not created PostId is not valid"})

			}

		} else {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Comment was not created"})
		}

	} else {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Comment was not created. Couldnt find user"})
	}

}

func UpdateComment(c *gin.Context) {
	id := c.Params.ByName("id")
	user, okUser := c.Get("User")
	var commentModel UpdateCommentModel

	if commentID, ok := strconv.ParseUint(id, 10, 32); ok == nil {
		if okUser {
			if c.Bind(&commentModel) == nil {
				if len(commentModel.Message) > 0 {

					context := db.Database()
					defer context.Close()
					var foundComment db.Comment
					foundComment.ID = uint(commentID)
					context.Find(&foundComment)
					//admin comment edit with admin id 1
					if foundComment.UserId == user.(db.User).ID || user.(db.User).ID == 1 {
						foundComment.Message = commentModel.Message
						context.Save(&foundComment)
						c.JSON(http.StatusCreated, gin.H{"message": "Comment updated successfully!", "id": foundComment.ID})

					} else {
						c.JSON(http.StatusUnauthorized, gin.H{"message": "Comment was not updated, you cant edit others comment"})
					}

				} else {
					c.JSON(http.StatusBadRequest, gin.H{"message": "Comment was not updated, Comment message is empty"})
				}
			} else {
				c.JSON(http.StatusBadRequest, gin.H{"message": "Comment was not updated"})
			}
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Comment was not created. Couldnt find user"})
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{})

	}

}

func DeleteComment(c *gin.Context) {
	id := c.Params.ByName("id")
	var comment db.Comment
	user, okUser := c.Get("User")

	if commentID, ok := strconv.ParseUint(id, 10, 32); ok == nil {

		if okUser && commentID > 0 {

			comment.ID = uint(commentID)
			context := db.Database()
			defer context.Close()
			context.Find(&comment)
			//admin user id is 1 he can delete what he wants
			if user.(db.User).ID == comment.UserId || user.(db.User).ID == 1 {

				context.Delete(&comment)
				var post db.Post
				context.Find(&post, comment.PostId)
				post.CommentCount--
				context.Save(&post)
				c.JSON(http.StatusOK, gin.H{"message": "Comment deleted successfully!"})
			} else {
				c.JSON(http.StatusUnauthorized, gin.H{"message": "You cannot delete this comment"})
			}
		} else {
			c.JSON(http.StatusBadRequest, gin.H{})

		}

	} else {
		c.JSON(http.StatusBadRequest, gin.H{})
	}

}

func FetchSingleComment(c *gin.Context) {
	id := c.Params.ByName("id")
	var comment db.Comment

	if commentID, ok := strconv.ParseUint(id, 10, 32); ok == nil {
		comment.ID = uint(commentID)
		context := db.Database()
		defer context.Close()
		context.Find(&comment)
		comment.User.Email = ""
		comment.User.Password = ""
		c.JSON(http.StatusOK, gin.H{"Comment": comment})
	} else {
		c.JSON(http.StatusBadRequest, gin.H{})
	}
}

func FetchAllComments(c *gin.Context) {

	var comments []db.Comment

	context := db.Database()
	defer context.Close()

	context.Order("created_at desc").Find(&comments)
	for y := range comments {
		comments[y].User.Password = ""
		comments[y].User.Email = ""
	}

	c.JSON(http.StatusOK, gin.H{"message": http.StatusOK, "data": comments})
}

func FetchAllCommentsForPost(c *gin.Context) {

	id := c.Params.ByName("id")
	var comments []db.Comment

	if postID, ok := strconv.ParseUint(id, 10, 32); ok == nil {

		context := db.Database()
		defer context.Close()
		context.Where("post_id = ?", postID).Order("created_at desc").Preload("User").Find(&comments)

		for y := range comments {
			comments[y].User.Password = ""
			comments[y].User.Email = ""
		}

		c.JSON(http.StatusOK, gin.H{"message": http.StatusOK, "data": comments, "postId": postID})
	}

}

func FetchCommentsOnPage(c *gin.Context) {

	pagePar := c.Params.ByName("pageId")
	postPar := c.Params.ByName("id")
	var comments []db.Comment

	if pageNum, okPage := strconv.ParseUint(pagePar, 10, 32); okPage == nil {
		if postID, okPost := strconv.ParseUint(postPar, 10, 32); okPost == nil {
			context := db.Database()
			defer context.Close()
			//context.Where("post_id = ?", postId).Order("created_at desc").Preload("User").Find(&comments)
			context.Where("post_id = ?", postID).Limit(db.PageSize).Offset(db.PageSize * pageNum).Order("created_at desc").Preload("User").Find(&comments)

			for y := range comments {
				comments[y].User.Password = ""
				comments[y].User.Email = ""
			}

			if len(comments) > 0 {
				c.JSON(http.StatusOK, gin.H{"message": http.StatusOK, "data": comments, "postId": postID})

			} else {
				c.JSON(http.StatusOK, gin.H{"message": "No more comments ;( "})
			}
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"message": "wrong post id"})
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"message": "wrong page number"})
	}

}
