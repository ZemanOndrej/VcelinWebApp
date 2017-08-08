package main

import (
	"github.com/gin-gonic/gin"
	"vcelin/server/api"
	"gopkg.in/gin-contrib/cors.v1"
	"time"
	"gopkg.in/olahol/melody.v1"
	"encoding/json"
	"fmt"
	"strings"
)

func main() {
	router := gin.Default()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	m := melody.New()
	m2 := melody.New()
	router.Use(cors.New(cors.Config{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"PUT", "POST", "GET", "DELETE"},
		AllowHeaders:     []string{"token", "cache-control", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: false,
		MaxAge:           12 * time.Hour,
	}))

	//web sockets
	router.GET("/vcelin/postListSocket/:token", func(c *gin.Context) {
		token := c.Params.ByName("token")
		err, userId := api.ValidateToken(token)
		fmt.Println(token)
		if !err || userId == 0 {
			c.AbortWithStatus(401)
		} else {
			m.HandleRequest(c.Writer, c.Request)
		}
	})

	m.HandleMessage(func(s *melody.Session, msg []byte) {

		post := api.CreatePostWebSocket(msg)
		str, _ := json.Marshal(post)
		m.Broadcast([]byte(str))
	})

	router.GET("/vcelin/postCommentsSocket/:name/$:token", func(c *gin.Context) {
		token := c.Params.ByName("token")
		err, userId := api.ValidateToken(token)
		if !err || userId == 0 {
			c.AbortWithStatus(401)
		} else {
			m2.HandleRequest(c.Writer, c.Request)
		}
	})

	m2.HandleMessage(func(s *melody.Session, msg []byte) {
		comment := api.CreateCommentWebSocket(msg)
		str, _ := json.Marshal(comment)

		m2.BroadcastFilter([]byte(str), func(q *melody.Session) bool {
			fmt.Println(strings.Split(q.Request.URL.Path, "$")[0], strings.Split(s.Request.URL.Path, "$")[0])
			return strings.Split(q.Request.URL.Path, "$")[0] == strings.Split(s.Request.URL.Path, "$")[0]
		})
	})



	//db.InitDb()
	api.InitKeys()

	authorized := router.Group("/vcelin")
	authorized.Use(api.AuthRequired())
	{
		authorized.POST("/api/users", api.CreateUser)
		authorized.PUT("/api/users/:id", api.UpdateUser)
		authorized.DELETE("/api/users/:id", api.DeleteUser)

		authorized.GET("/api/users", api.GetUsers)
		authorized.GET("/api/users/:id", api.GetUser)

		authorized.POST("/api/posts", api.CreatePost)
		authorized.PUT("/api/posts/:id", api.UpdatePost)
		authorized.DELETE("/api/posts/:id", api.DeletePost)

		authorized.GET("/api/posts/:id", api.FetchSinglePost)
		authorized.GET("/api/posts", api.FetchAllPosts)
		authorized.GET("/api/postsPage/:id", api.FetchPostsOnPage)

		authorized.POST("/api/comments", api.CreateComment)
		authorized.PUT("/api/comments/:id", api.UpdateComment)
		authorized.DELETE("/api/comments/:id", api.DeleteComment)

		authorized.GET("/api/comments/:id", api.FetchSingleComment)
		authorized.GET("/api/comments", api.FetchAllComments)
		authorized.GET("/api/post/:id/comments", api.FetchAllCommentsForPost)
		authorized.GET("/api/post/:id/commentsPage/:pageId", api.FetchCommentsOnPage)

		authorized.POST("/api/uploadImage", api.UploadImage)
		authorized.POST("/api/articles", api.CreateArticle)

		authorized.DELETE("/api/cancelArticle", api.CancelArticle)
		authorized.DELETE("/api/articles/:id", api.DeleteArticle)
		authorized.DELETE("/api/images/:id", api.RemoveImageFromArticle)
		authorized.PUT("/api/articles/:id", api.UpdateArticle)

	}

	router.LoadHTMLFiles("./client/src/index.html")
	router.NoRoute(index)
	r := router.Group("/vcelin")
	{
		r.GET("/", index)
		r.POST("/api/login", api.Login)
		r.POST("/api/register", api.Register)
		r.Static("/css", "./client/src/css")
		r.Static("/js", "./client/src/js")
		r.POST("/tokenValidation", api.TokenValidation)
		r.GET("/api/articlesPage/:id", api.FetchArticlesOnPage)

		r.GET("/api/articles/:id", api.FetchArticle)
		r.GET("/api/images/:id", api.FetchImage)

		r.Static("/img", "./server/images")
		r.Static("/staticImg", "./server/staticImages")

	}
	router.Run(":5513")
}

func index(c *gin.Context) {
	c.HTML(200, "index.html", gin.H{})
}
