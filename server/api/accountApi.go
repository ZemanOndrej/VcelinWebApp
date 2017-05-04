package api

import (
	"github.com/dgrijalva/jwt-go"
	"fmt"
	"net/http"
	"golang.org/x/crypto/bcrypt"
	"time"
	"log"
	"github.com/gin-gonic/gin"
	"crypto/rsa"
	"encoding/pem"
	"crypto/x509"
	"bytes"
	cryptorand "crypto/rand"
	"vcelin/server/db"
	"strconv"
)

type LoginModel struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type RegisterModel struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
	Name     string `json:"username" binding:"required"`
}

var signingKey, verificationKey []byte

func InitKeys() {

	/**
	Init keys for jwt
	 */
	var (
		err error
		privKey     *rsa.PrivateKey
		pubKey      *rsa.PublicKey
		pubKeyBytes []byte
	)

	privKey, err = rsa.GenerateKey(cryptorand.Reader, 2048)
	if err != nil {
		log.Fatal("Error generating private key")
	}
	pubKey = &privKey.PublicKey //hmm, this is stdlib manner...

	// Create signingKey from privKey
	// prepare PEM block
	var privPEMBlock = &pem.Block{
		Type:  "RSA PRIVATE KEY",
		Bytes: x509.MarshalPKCS1PrivateKey(privKey), // serialize private key bytes
	}
	// serialize pem
	privKeyPEMBuffer := new(bytes.Buffer)
	pem.Encode(privKeyPEMBuffer, privPEMBlock)
	//done
	signingKey = privKeyPEMBuffer.Bytes()

	//fmt.Println(string(signingKey))

	// create verificationKey from pubKey. Also in PEM-format
	pubKeyBytes, err = x509.MarshalPKIXPublicKey(pubKey) //serialize key bytes
	if err != nil {
		// heh, fatality
		log.Fatal("Error marshalling public key")
	}

	var pubPEMBlock = &pem.Block{
		Type:  "RSA PUBLIC KEY",
		Bytes: pubKeyBytes,
	}
	// serialize pem
	pubKeyPEMBuffer := new(bytes.Buffer)
	pem.Encode(pubKeyPEMBuffer, pubPEMBlock)
	// done
	verificationKey = pubKeyPEMBuffer.Bytes()

	//fmt.Println(string(verificationKey))
}

func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		raw := c.Request.Header.Get("token")

		token, err := jwt.Parse(raw, func(token *jwt.Token) (interface{}, error) {
			// Don't forget to validate the alg is what you expect:
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
			}

			return []byte(signingKey), nil
		})
		if err == nil {
			if token.Valid {
				var foundUser db.User
				claims := token.Claims.(jwt.MapClaims)


				//fmt.Printf("\n<"+claims["userId"].(string)+">\n")
				if s, ok := strconv.ParseUint(claims["userId"].(string), 10, 32); ok == nil {
					//fmt.Printf("%s, %v\n", fmt.Sprint(claims["userId"]), s)


					foundUser.ID = uint(s)
					context := db.Database()
					defer context.Close()

					context.First(&foundUser)
					//fmt.Printf(fmt.Sprint(foundUser))
					c.Set("User", foundUser)
					c.Next()
				} else {
					c.AbortWithError(http.StatusUnauthorized, ok)

				}



			} else {
				fmt.Print("Token is not valid \n")
				c.AbortWithError(http.StatusUnauthorized, err)
			}
		} else {
			fmt.Errorf("Unauthorised access to this resource %s", err)
			c.AbortWithError(http.StatusUnauthorized, err)
		}
	}
}

func Login(c *gin.Context) {
	var loginModel LoginModel
	if c.Bind(&loginModel) == nil {
		context := db.Database()
		var foundUser db.User

		context.Where("email = ?", loginModel.Email).First(&foundUser)
		err := bcrypt.CompareHashAndPassword([]byte(foundUser.Password), []byte(loginModel.Password))

		if foundUser.ID > 0 && err == nil {

			token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
				"exp": time.Now().Add(time.Minute * 30).Unix(),
				"iat": time.Now().Unix(),
				"iss":"admin",
				"alg":"hs256",
				"userId":fmt.Sprint(foundUser.ID),
				"role":"Member",
			})

			tokenString, err := token.SignedString([]byte(signingKey))
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"status": "error"})
				log.Printf("Error signing token: %v\n", err)
				return
			}

			c.JSON(http.StatusOK, gin.H{"status": "you are logged in", "email":loginModel.Email, "token":tokenString})
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"status": "unauthorized"})
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"status": "wrong arguments"})
		fmt.Print("could not bind")
	}
}

func Register(c *gin.Context) {
	var registerModel RegisterModel
	if c.Bind(&registerModel) == nil {
		context := db.Database()
		var foundUser db.User
		context.Where("email = ?", registerModel.Email).First(&foundUser)
		if foundUser.ID <= 0 {
			hashedPw, err := bcrypt.GenerateFromPassword([]byte(registerModel.Password), bcrypt.DefaultCost)
			if err == nil {
				user := db.User{
					Name:registerModel.Name,
					Email:registerModel.Email,
					Password:string(hashedPw),
				}
				context.Create(&user)
				c.JSON(http.StatusOK, gin.H{"status": "you have been successfully registered", "userEmail":registerModel.Email})
			} else {
				log.Printf("Error hashing: %v\n", err)
				c.JSON(http.StatusInternalServerError, gin.H{"status": "something went wrong"})
			}
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"status": "email is taken", "userEmail":registerModel.Email})

			log.Print("email is already taken")
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"status": "wrong arguments"})

		fmt.Print("could not bind")
	}
}