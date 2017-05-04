package api

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"vcelin/server/db"
	"fmt"
	"strconv"
)

type PostModel struct {
	Message string `json:"message" binding:"required"`
}



func CreatePost(c *gin.Context) {
	user, err := c.Get("User")
	var postModel PostModel

	if err {
		if c.Bind(&postModel) == nil {
			fmt.Printf("\n< " + postModel.Message + "> \n")
			if len(postModel.Message) > 0 {

				context := db.Database()
				defer context.Close()
				post := db.Post{Message: postModel.Message, User:user.(db.User)};
				context.Create(&post)
				c.JSON(http.StatusCreated, gin.H{"message" : "Post item created successfully!", "id": post.ID})
			} else {
				c.JSON(http.StatusBadRequest, gin.H{"message" : "Post was not created, Post message is empty"})

			}

		} else {
			c.JSON(http.StatusBadRequest, gin.H{"message" : "Post was not created"})
		}

	} else {
		c.JSON(http.StatusBadRequest, gin.H{"message" : "Post was not created. Couldnt find user"})
	}

}

func FetchAllPosts(c *gin.Context) {

	var posts [] db.Post

	context := db.Database()
	context.Find(&posts)
	context.Close()

	if (len(posts) <= 0) {
		c.JSON(http.StatusNotFound, gin.H{"status" : http.StatusNotFound, "message" : "No posts found!"})
	}

	c.JSON(http.StatusOK, gin.H{"status" : http.StatusOK, "data" : posts})
}

func FetchSinglePost(c *gin.Context) {
	id := c.Params.ByName("id")
	var Post db.Post

	if userId, ok := strconv.ParseUint(id, 10, 32); ok == nil {
		if len(Post.Message) > 0 {
			Post.ID = uint(userId)
			context := db.Database()
			context.Find(&Post)
			c.JSON(http.StatusOK, gin.H{"Post" : Post})
		} else {
			c.JSON(http.StatusBadRequest, gin.H{})
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{})
	}

}

func UpdatePost(c *gin.Context) {
	id := c.Params.ByName("id")
	user, err := c.Get("User")
	var postModel PostModel

	if postId, ok := strconv.ParseUint(id, 10, 32); ok == nil {
		if err {
			if c.Bind(&postModel) == nil {
				if len(postModel.Message) > 0 {

					context := db.Database()
					defer context.Close()
					var foundPost db.Post
					foundPost.ID = uint(postId)
					context.Find(&foundPost)
					if foundPost.UserId == user.(db.User).ID {
						foundPost.Message = postModel.Message
						context.Save(&foundPost)
						c.JSON(http.StatusCreated, gin.H{"message" : "Post updated successfully!", "id": foundPost.ID})

					} else {
						c.JSON(http.StatusBadRequest, gin.H{"message" : "Post was not updated, you cant edit others posts"})
					}

				} else {
					c.JSON(http.StatusBadRequest, gin.H{"message" : "Post was not updated, Post message is empty"})

				}

			} else {
				c.JSON(http.StatusBadRequest, gin.H{"message" : "Post was not updated"})
			}

		} else {
			c.JSON(http.StatusBadRequest, gin.H{"message" : "Post was not updated. Couldnt find user"})
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{})

	}
}

func DeletePost(c *gin.Context) {
	id := c.Params.ByName("id")
	var Post db.Post

	if postId, ok := strconv.ParseUint(id, 10, 32); ok == nil {
		if postId > 0 {
			Post.ID = uint(postId)
			context := db.Database()
			context.Delete(&Post)
			c.JSON(http.StatusOK, gin.H{"status" : http.StatusOK, "message" : "Post deleted successfully!"})

		} else {
			c.JSON(http.StatusBadRequest, gin.H{})

		}

	} else {
		c.JSON(http.StatusBadRequest, gin.H{})
	}

}