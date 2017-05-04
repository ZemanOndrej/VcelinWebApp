package main

import (
	"github.com/gin-gonic/gin"
	"vcelin/server/api"
	_ "vcelin/server/db"
	"vcelin/server/db"
)

func main() {
	router := gin.Default()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	api.InitKeys()
	db.InitDb()

	authorized := router.Group("/vcelin")
	authorized.Use(api.AuthRequired())
	{
		authorized.POST("/api/posts", api.CreatePost)
		authorized.GET("/api/posts", api.FetchAllPosts)
		authorized.GET("/api/posts/:id", api.FetchSinglePost)
		authorized.PUT("/api/posts/:id", api.UpdatePost)
		authorized.DELETE("/api/posts/:id", api.DeletePost)
		authorized.POST("/api/users", api.PostUser)
		authorized.GET("/api/users", api.GetUsers)
		authorized.GET("/api/users/:id", api.GetUser)
		authorized.PUT("/api/users/:id", api.UpdateUser)
		authorized.DELETE("/api/users/:id", api.DeleteUser)
		authorized.POST("/api/comments", api.CreateComment)
		authorized.GET("/api/comments", api.FetchAllComments)
		authorized.GET("/api/comments/:id", api.FetchSingleComment)
		authorized.PUT("/api/comments/:id", api.UpdateComment)
		authorized.DELETE("/api/comments/:id", api.DeleteComment)
	}

	v1 := router.Group("/vcelin")
	{
		v1.POST("/api/login", api.Login)
		v1.POST("/api/register", api.Register)
	}
	router.Run(":1337")
}




