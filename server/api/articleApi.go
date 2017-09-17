package api

import (
	"github.com/gin-gonic/gin"
	"vcelin/server/db"
	"strconv"
	"net/http"
	"os"
	"encoding/base64"
	"time"
	"math/rand"
	"strings"
	"io/ioutil"
	"log"
	"io"
)

type ArticleModel struct {
	Title        string `json:"Title" binding:"required"`
	Text         string `json:"Text"`
	NewImages    [] ImageModel `json:"NewImages" binding:"required"`
	DeleteImages [] string `json:"DeleteImages" binding:"required"`
}

type ImageModel struct {
	Name     string `json:"Name" binding:"required"`
	Filename string `json:"Filename" binding:"required"`
	Position uint `json:"Position" binding:"required"`
}

type ArticleCancelModel struct {
	ImageFilenames [] string `json:"imageFilenames" binding:"required"`
}

func CreateArticle(c *gin.Context) {

	loggedUser, err := c.Get("User")
	var articleModel ArticleModel

	if err {
		if c.Bind(&articleModel) == nil {

			if len(articleModel.Title) > 0 {

				context := db.Database()
				defer context.Close()
				article := db.Article{Text: articleModel.Text, Title: articleModel.Title, User: loggedUser.(db.User)}
				context.Create(&article)

				for _, elem := range articleModel.DeleteImages {
					os.Remove(db.ImagesTmpURI + elem)
				}

				var imgSlice []db.Image
				for _, image := range articleModel.NewImages {
					err := os.Rename(db.ImagesTmpURI+image.Filename, db.ImagesURI+image.Filename)
					if err == nil {

						newImage := db.Image{
							Name:     image.Name,
							Filename: image.Filename,
							Article:  article,
							Position: image.Position}
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
				c.JSON(http.StatusBadRequest, gin.H{"message": "Article was not created, Invalid title"})

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
		context.Limit(db.PageSize).Offset(db.PageSize * pageNum).Order("created_at desc").Preload("User").Preload("Images").Find(&articles)
		for y := range articles {
			articles[y].User.Password = ""
			articles[y].User.Email = ""
		}
		if len(articles) > 0 {
			c.JSON(http.StatusOK, gin.H{"message": http.StatusOK, "data": articles})

		} else {
			c.JSON(http.StatusOK, gin.H{"message": "No more articles ;( "})
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"message": "wrong page number"})

	}

}

func UploadImage(c *gin.Context) {
	body, meta, err := c.Request.FormFile("image")
	if err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}
	filename := RandomString() + "-" + meta.Filename

	file, err := os.Create(db.ImagesTmpURI + filename)
	if err != nil {
		log.Fatal(err)
	}
	if _, err := io.Copy(file, body); err != nil {
		log.Fatal(err)
	}

	defer body.Close()
	defer file.Close()
	c.JSON(http.StatusOK, gin.H{"message": "Image uploaded successfuly", "filename": filename})

}

func CancelArticle(c *gin.Context) {
	var articleCancelModel ArticleCancelModel
	if c.Bind(&articleCancelModel) == nil {
		if len(articleCancelModel.ImageFilenames) > 0 {
			max := len(articleCancelModel.ImageFilenames)
			for i := 0; i < max; i++ {
				err := os.Remove(db.ImagesTmpURI + articleCancelModel.ImageFilenames[i])
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
		context := db.Database()
		defer context.Close()
		context.Preload("User").Preload("Images").First(&article, articleId)

		if article.ID != 0 {
			article.User.Email = ""
			article.User.Password = ""
			c.JSON(http.StatusOK, gin.H{"data": article})
		} else {
			c.AbortWithStatus(http.StatusNotFound)
		}
	} else {
		c.AbortWithStatus(http.StatusBadRequest)
	}

}

func FetchImage(c *gin.Context) {
	id := c.Params.ByName("id")
	var img db.Image

	if imageId, ok := strconv.ParseUint(id, 10, 32); ok == nil {
		context := db.Database()
		defer context.Close()
		context.First(&img, imageId)

		file, err := ioutil.ReadFile(db.ImagesURI + img.Filename)
		if err != nil {
			panic(err)
		}
		base := base64.StdEncoding.EncodeToString(file)
		//io.Copy(c.Writer,io.Reader(db.ImagesURI + img.FileName))

		c.JSON(http.StatusOK, gin.H{"image": img, "data": "data:image/" + strings.Split(img.Filename, ".")[1] + ";base64," + base})
	} else {
		c.JSON(http.StatusBadRequest, gin.H{})
	}

}

func DeleteArticle(c *gin.Context) {

	id := c.Params.ByName("id")
	var article db.Article
	user, okUser := c.Get("User")

	if articleId, ok := strconv.ParseUint(id, 10, 32); ok == nil {
		if okUser && articleId > 0 {
			article.ID = uint(articleId)
			context := db.Database()
			defer context.Close()
			context.Preload("Images").Find(&article)
			for _, el := range article.Images {
				err := os.Remove(db.ImagesURI + el.Filename)
				if err == nil {
				} else {
					log.Fatal(err)
					c.AbortWithError(500, err)
				}
				context.Delete(&el)
			}
			//admin user id is 1 he can delete what he wants
			if user.(db.User).ID == article.UserId || user.(db.User).ID == 1 {
				context.Delete(&article)
				c.JSON(http.StatusOK, gin.H{"message": "article deleted successfully!"})
			} else {
				c.JSON(http.StatusUnauthorized, gin.H{"message": "You cannot delete this article!"})
			}

		} else {
			c.JSON(http.StatusBadRequest, gin.H{})

		}

	} else {
		c.JSON(http.StatusBadRequest, gin.H{})
	}
}

func RemoveImageFromArticle(c *gin.Context) {

	id := c.Params.ByName("id")
	var image db.Image

	if imageId, ok := strconv.ParseUint(id, 10, 32); ok == nil {
		if imageId > 0 {
			context := db.Database()
			defer context.Close()
			context.Find(&image, imageId)
			os.Remove(db.ImagesURI + image.Filename)
			context.Delete(&image)
			c.JSON(http.StatusOK, gin.H{"message": "Image deleted successfully!"})

		} else {
			c.JSON(http.StatusBadRequest, gin.H{})

		}

	} else {
		c.JSON(http.StatusBadRequest, gin.H{})
	}
}

func UpdateArticle(c *gin.Context) {
	id := c.Params.ByName("id")

	loggedUser, err := c.Get("User")
	var articleModel ArticleModel
	if articleId, ok := strconv.ParseUint(id, 10, 32); ok == nil {

		if err {
			if c.Bind(&articleModel) == nil {

				if len(articleModel.Title) > 0 && len(articleModel.Text) > 0 {

					context := db.Database()

					defer context.Close()
					var article db.Article
					article.ID = uint(articleId)

					context.Preload("User").Preload("Images").Find(&article)
					//admin can edit article with id 1
					if article.UserId == loggedUser.(db.User).ID || loggedUser.(db.User).ID == 1 || (articleModel.Title == article.Title && articleModel.Text == article.Text) {
						article.Text = articleModel.Text
						article.Title = articleModel.Title

						for _, elem := range articleModel.DeleteImages {
							os.Remove(db.ImagesTmpURI + elem)
							os.Remove(db.ImagesURI + elem)
							filtered := []db.Image{}
							for _, v := range article.Images {
								if v.Filename != elem {
									filtered = append(filtered, v)
								}
							}
							article.Images = filtered
							context.Where("filename = ?", elem).Delete(db.Image{})
						}

						var imgSlice []db.Image

						for _, i := range articleModel.NewImages {
							err := os.Rename(db.ImagesTmpURI+i.Filename,
								db.ImagesURI+i.Filename)
							if err == nil {

								newImage := db.Image{Name: i.Name,
									Filename:              i.Filename,
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

						c.JSON(http.StatusCreated, gin.H{"message": "Article successfully updated!", "id": article.ID})
					} else {
						c.JSON(http.StatusUnauthorized, gin.H{"message": "Article was not updated, you cant edit others articles"})
					}
				} else {
					c.JSON(http.StatusBadRequest, gin.H{"message": "Article was not updated, Invalid text lenght or image arrays arent as large"})
				}
			} else {
				c.JSON(http.StatusBadRequest, gin.H{"message": "Article was not updated. Cant bind model"})
			}
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Article was not updated. User not found"})
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{})

	}
}
