package api

import (
	"github.com/gin-gonic/gin"
	"vcelin/server/db"
	"strconv"
	"net/http"
	_"fmt"
	"os"
	_ "io"
	_"image/png"
	_"strings"
	_"io/ioutil"
	"encoding/base64"

	"time"
	"math/rand"
	"strings"
	"io/ioutil"
	"log"
	"io"
	"bytes"
)

type ArticleModel struct {
	Title          string `json:"title" binding:"required"`
	Text           string `json:"text" binding:"required"`
	ImageFileNames [] string `json:"imageFileNames" binding:"required"`
	ImageNames     [] string `json:"imageNames" binding:"required"`
}

type ArticleCancelModel struct {
	ImageFileNames [] string `json:"imageFileNames" binding:"required"`
}

func CreateArticle(c *gin.Context) {

	loggedUser, err := c.Get("User")
	var articleModel ArticleModel

	if err {
		if c.Bind(&articleModel) == nil {

			if len(articleModel.Title) > 0 && len(articleModel.Text) > 0 && len(articleModel.ImageFileNames) == len(articleModel.ImageNames) {

				context := db.Database()
				defer context.Close()
				article := db.Article{Text: articleModel.Text, Title: articleModel.Title, User: loggedUser.(db.User)}
				context.Create(&article)

				max := len(articleModel.ImageFileNames)

				var imgSlice []db.Image
				for i := 0; i < max; i++ {
					err := os.Rename(db.ImagesTmpURI+articleModel.ImageFileNames[i], db.ImagesURI+articleModel.ImageFileNames[i])
					if err == nil {

						newImage := db.Image{Name: articleModel.ImageNames[i],
							FileName:              articleModel.ImageFileNames[i],
							Article:               article}
						context.Create(&newImage)
						imgSlice = append(imgSlice, newImage)
					} else {
						log.Fatal(err)
						c.AbortWithError(500, err)

					}
				}
				article.Images = append(article.Images, imgSlice...)
				context.Save(&article)

				article.User.Email = ""
				article.User.Password = ""
				c.JSON(http.StatusCreated, gin.H{"message": "Article created successfully!", "article": article})

			} else {
				c.JSON(http.StatusBadRequest, gin.H{"message": "Article was not created, Invalid text lenght or image arrays arent as large"})

			}
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Article was not created. Cant bind model"})

		}

	} else {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Article was not created. User not found"})
	}

}

func FetchArticlesOnPage(c *gin.Context) {

	id := c.Params.ByName("id")
	var articles [] db.Article

	if pageNum, ok := strconv.ParseUint(id, 10, 32); ok == nil {

		context := db.Database()
		defer context.Close()
		context.Limit(db.PageSize).Offset(db.PageSize * pageNum).Order("created_at desc").Preload("User").Find(&articles)
		for y := range articles {
			articles[y].User.Password = ""
			articles[y].User.Email = ""
		}
		if len(articles) > 0 {
			c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "data": articles})

		} else {
			c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "message": "No more posts ;( " })
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"message": "wrong page number"})

	}

}

func UploadImage(c *gin.Context) {
	file, _ := ioutil.ReadAll(c.Request.Body)
	str := string(file[:])
	filename := RandomString() + "-" + c.Request.Header.Get("filename")
	stringArr := strings.SplitN(str, ",", 2)

	SaveImage(stringArr[1], filename)
	c.JSON(http.StatusOK, gin.H{"status": "Image uploaded successfuly", "filename": filename })

}

func CancelArticle(c *gin.Context) {
	var articleCancelModel ArticleCancelModel
	if c.Bind(&articleCancelModel) == nil {
		if len(articleCancelModel.ImageFileNames) > 0 {
			max := len(articleCancelModel.ImageFileNames)
			for i := 0; i < max; i++ {
				err := os.Remove(db.ImagesTmpURI + articleCancelModel.ImageFileNames[i])
				if err == nil {
				} else {
					log.Fatal(err)
					c.AbortWithError(500, err)
				}
			}
			c.JSON(http.StatusOK, gin.H{"message": "Article cancelled successfully!"})

		} else {
			c.JSON(http.StatusOK, gin.H{"message": "Article cancelled successfully!"})
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Cant bind model"})

	}
}

func SaveImage(img string, filename string) {
	unbased, err := base64.StdEncoding.DecodeString(img)
	if err != nil {
		panic("Cannot decode b64")
	}
	reader := bytes.NewReader(unbased)
	file, err := os.Create(db.ImagesTmpURI + filename)
	defer file.Close()
	if err != nil {
		log.Fatal(err)
	}
	_, err = io.Copy(file, reader)
	if err != nil {
		log.Fatal(err)
	}

}

func RandomString() string {
	const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	r := rand.New(rand.NewSource(time.Now().UnixNano()))

	result := make([]byte, 8)
	for i := range result {
		result[i] = chars[r.Intn(len(chars))]
	}
	return string(result)
}

func FetchArticle(c *gin.Context) {
	id := c.Params.ByName("id")
	var article db.Article

	if articleId, ok := strconv.ParseUint(id, 10, 32); ok == nil {
		article.ID = uint(articleId)
		context := db.Database()
		defer context.Close()
		context.Preload("User").Preload("Images").Find(&article)
		article.User.Email = ""
		article.User.Password = ""
		c.JSON(http.StatusOK, gin.H{"data": article})
	} else {
		c.JSON(http.StatusBadRequest, gin.H{})
	}

}

func FetchImage(c *gin.Context) {
	id := c.Params.ByName("id")
	var img db.Image

	if postId, ok := strconv.ParseUint(id, 10, 32); ok == nil {
		img.ID = uint(postId)
		context := db.Database()
		defer context.Close()
		context.Find(&img)

		file, err := ioutil.ReadFile(db.ImagesURI + img.FileName)
		if err != nil {
			panic(err)
		}
		base := base64.StdEncoding.EncodeToString(file)

		c.JSON(http.StatusOK, gin.H{"Image": img, "data": "data:image/" + strings.Split(img.FileName, ".")[1] + ";base64," + base})
	} else {
		c.JSON(http.StatusBadRequest, gin.H{})
	}

}
