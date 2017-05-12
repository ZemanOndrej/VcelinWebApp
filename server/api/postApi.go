package api

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"vcelin/server/db"
	"fmt"
	"strconv"
	"github.com/jinzhu/gorm"
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
				post.User.Password = ""
				post.User.Email = ""
				c.JSON(http.StatusCreated, gin.H{"message" : "Post item created successfully!", "post": post})
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
	defer context.Close()
	context.Order("created_at desc").Preload("User").Find(&posts)
	c.JSON(http.StatusOK, gin.H{"status" : http.StatusOK, "data" : posts})
}

func FetchSinglePost(c *gin.Context) {
	id := c.Params.ByName("id")
	var Post db.Post

	fmt.Println(id)
	if postId, ok := strconv.ParseUint(id, 10, 32); ok == nil {
		Post.ID = uint(postId)
		context := db.Database()
		defer context.Close()
		context.Preload("User").Preload("Comments", func(db *gorm.DB) *gorm.DB {
			return db.Order("comments.created_at desc")
		}).Preload("Comments.User").Find(&Post)
		Post.User.Email = ""
		Post.User.Password = ""
		for i := range Post.Comments {
			Post.Comments[i].User.Password = ""
			Post.Comments[i].User.Email = ""
		}
		c.JSON(http.StatusOK, gin.H{"Post" : Post})
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
					//admin can edit post with id 1
					if foundPost.UserId == user.(db.User).ID || user.(db.User).ID == 1 {
						foundPost.Message = postModel.Message
						context.Save(&foundPost)
						c.JSON(http.StatusCreated, gin.H{"message" : "Post updated successfully!", "id": foundPost.ID})

					} else {
						c.JSON(http.StatusUnauthorized, gin.H{"message" : "Post was not updated, you cant edit others posts"})
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
	user, okUser := c.Get("User")

	if postId, ok := strconv.ParseUint(id, 10, 32); ok == nil {
		if okUser && postId > 0 {
			Post.ID = uint(postId)
			context := db.Database()
			defer context.Close()
			context.Find(&Post)
			//admin user id is 1 he can delete what he wants
			if user.(db.User).ID == Post.UserId || user.(db.User).ID == 1 {
				context.Delete(&Post)
				c.JSON(http.StatusOK, gin.H{"status" : http.StatusOK, "message" : "Post deleted successfully!"})
			} else {
				c.JSON(http.StatusUnauthorized, gin.H{"message":"You cannot delete this post"})
			}

		} else {
			c.JSON(http.StatusBadRequest, gin.H{})

		}

	} else {
		c.JSON(http.StatusBadRequest, gin.H{})
	}

}