package router

import (
	"apis/comments"
	"apis/database"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func AddCommentHandler(c *gin.Context) {
	var comment comments.Comments

	if err := c.ShouldBindJSON(&comment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
		return
	}

	_, err := database.MongoDB.GetProperty(strconv.Itoa(comment.ApartmentID))

	if err == nil {
		err := database.MongoDB.AddComment(comment.ApartmentID, comment.Comment)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save comment"})
			return
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "The apartment doesnt exist"})
		return
	}
}

func DeleteCommentHandler(c *gin.Context) {
	query := c.Param("query")

	_, err := database.MongoDB.GetComment(query)

	if err == nil {
		err := database.MongoDB.DeleteComment(query)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "invalid delete"})
			return
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"message": "comment doesnt exist"})
		return
	}
}

func GetCommentHandler(c *gin.Context) {
	query := c.Param("query")

	comment, err := database.MongoDB.GetComment(query)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "comment doesnt exist"})
	}

	c.JSON(http.StatusOK, gin.H{"comment": comment})
}

// func getAllCommentsForHousing(housingId string) map[string]comments.Comments {
// 	var comments = make(map[string]comments.Comments)
// 	for key, value := range data.Comments {
// 		if value.HousingID == housingId {
// 			comments[key] = value
// 		}
// 	}
// 	return comments
// }
