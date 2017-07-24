package api

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"vcelin/server/db"
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
			if len(postModel.Message) > 0 {

				context := db.Database()
				defer context.Close()
				post := db.Post{Message: postModel.Message, User: user.(db.User)}
				context.Create(&post)
				post.User.Password = ""
				post.User.Email = ""
				c.JSON(http.StatusCreated, gin.H{"message": "Post item created successfully!", "post": post})
			} else {
				c.JSON(http.StatusBadRequest, gin.H{"message": "Post was not created, Post message is empty"})

			}

		} else {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Post was not created"})
		}

	} else {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Post was not created. Couldnt find user"})
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
						c.JSON(http.StatusCreated, gin.H{"message": "Post updated successfully!", "id": foundPost.ID})

					} else {
						c.JSON(http.StatusUnauthorized, gin.H{"message": "Post was not updated, you cant edit others posts"})
					}

				} else {
					c.JSON(http.StatusBadRequest, gin.H{"message": "Post was not updated, Post message is empty"})

				}

			} else {
				c.JSON(http.StatusBadRequest, gin.H{"message": "Post was not updated"})
			}

		} else {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Post was not updated. Couldnt find user"})
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
				c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "message": "Post deleted successfully!"})
			} else {
				c.JSON(http.StatusUnauthorized, gin.H{"message": "You cannot delete this post"})
			}

		} else {
			c.JSON(http.StatusBadRequest, gin.H{})

		}

	} else {
		c.JSON(http.StatusBadRequest, gin.H{})
	}

}

func FetchSinglePost(c *gin.Context) {
	id := c.Params.ByName("id")
	var post db.Post

	if postId, ok := strconv.ParseUint(id, 10, 32); ok == nil {
		context := db.Database()
		defer context.Close()
		context.Preload("User").Preload("Comments", func(context *gorm.DB) *gorm.DB {
			return context.Limit(db.PageSize).Order("comments.created_at desc")
		}).Preload("Comments.User").First(&post, postId)
		if post.ID != 0 {
			post.User.Email = ""
			post.User.Password = ""
			for i := range post.Comments {
				post.Comments[i].User.Password = ""
				post.Comments[i].User.Email = ""
			}
			c.JSON(http.StatusOK, gin.H{"post": post})
		} else {
			c.AbortWithStatus(http.StatusNotFound)
		}

	} else {
		c.AbortWithStatus(http.StatusBadRequest)

	}

}

func FetchAllPosts(c *gin.Context) {

	var posts [] db.Post

	context := db.Database()
	defer context.Close()
	context.Order("created_at desc").Preload("User").Find(&posts)
	if len(posts) > 0 {
		for y := range posts {
			posts[y].User.Password = ""
			posts[y].User.Email = ""
		}
	}
	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "data": posts})

}

func FetchPostsOnPage(c *gin.Context) {

	id := c.Params.ByName("id")
	var posts [] db.Post

	if pageNum, ok := strconv.ParseUint(id, 10, 32); ok == nil {

		context := db.Database()
		defer context.Close()
		context.Limit(db.PageSize).Offset(db.PageSize * pageNum).Order("created_at desc").Preload("User").Find(&posts)
		for y := range posts {
			posts[y].User.Password = ""
			posts[y].User.Email = ""
		}
		if len(posts) > 0 {
			c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "data": posts})

		} else {
			c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "message": "No more posts ;( " })
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"message": "wrong page number"})

	}

}
