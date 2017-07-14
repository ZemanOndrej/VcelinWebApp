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
	"bytes"
	"image/png"
	"time"
	"math/rand"
	"strings"
	"io/ioutil"
	"log"
)

//type ImageModel struct {
//	Image []byte  `json:"image" bidning:"required"`
//}

type ArticleModel struct {
	Title          string `json:"title" binding:"required"`
	Text           string `json:"text" binding:"required"`
	ImageFileNames [] string `json:"imageFileNames" binding:"required"`
	ImageNames     [] string `json:"imageNames" binding:"required"`
}

func CreateArticle(c *gin.Context) {

	user, err := c.Get("User")
	var articleModel ArticleModel

	if err {
		if c.Bind(&articleModel) == nil {

			if len(articleModel.Title) > 0 && len(articleModel.Text) > 0 && len(articleModel.ImageFileNames) == len(articleModel.ImageNames) {

				context := db.Database()
				defer context.Close()
				article := db.Article{Text:articleModel.Text, Title:articleModel.Title, User:user.(db.User)};
				context.Create(&article)

				max := len(articleModel.ImageFileNames)

				var imgSlice []db.Image;
				for i := 0; i < max; i++ {
					err := os.Rename("./server//tmp/" + articleModel.ImageFileNames[i], "./server//images/" + articleModel.ImageFileNames[i])
					if (err == nil ) {

						newImage := db.Image{Name:articleModel.ImageNames[i],
							FileName:articleModel.ImageFileNames[i],
							Article:article}
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
				c.JSON(http.StatusCreated, gin.H{"message" : "Article created successfully!", "article": article})

			} else {
				c.JSON(http.StatusBadRequest, gin.H{"message" : "Article was not created, Invalid text lenght or image arrays arent as large"})

			}
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"message" : "Article was not created. Cant bind model"})

		}

	} else {
		c.JSON(http.StatusBadRequest, gin.H{"message" : "Article was not created. User not found"})
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
		if (len(articles) > 0) {
			c.JSON(http.StatusOK, gin.H{"status" : http.StatusOK, "data" : articles})

		} else {
			c.JSON(http.StatusOK, gin.H{"status" : http.StatusOK, "message": "No more posts ;( " })
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"message":"wrong page number"})

	}

}

func UploadImage(c *gin.Context) {
	file, _ := ioutil.ReadAll(c.Request.Body)
	str := string(file[:])
	filename := RandomString() + c.Request.Header.Get("filename")
	str = strings.SplitN(str, ",", 2)[1]
	SaveImage(str, filename)
	c.JSON(http.StatusOK, gin.H{"status": "Image uploaded successfuly", "filename":filename })

}

func SaveImage(img string, filename string) {
	unbased, err := base64.StdEncoding.DecodeString(img)
	if err != nil {
		panic("Cannot decode b64")
	}

	r := bytes.NewReader(unbased)
	im, err := png.Decode(r)
	if err != nil {
		panic("Bad png")
	}

	f, err := os.OpenFile("./server/tmp/" + filename, os.O_WRONLY | os.O_CREATE, 0777)
	defer f.Close()
	if err != nil {
		panic("Cannot open file")
	}

	png.Encode(f, im)
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
