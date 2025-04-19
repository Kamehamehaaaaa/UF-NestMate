package router

import (
	"apis/database"
	"apis/housing"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"sort"
	"strconv"
	"strings"

	"apis/cloudinary"

	"github.com/gin-gonic/gin"
	"github.com/go-resty/resty/v2"
)

const (
	apiEndpoint = "https://api.openai.com/v1/chat/completions"
)

func GetHousingHandler(c *gin.Context) {
	query := c.Param("query")

	fmt.Println(query)

	property, err := database.MongoDB.GetProperty(query)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Property not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"property": property})
}

func GetAllHousingHandler(c *gin.Context) {

	apartments, err := database.MongoDB.GetAllProperties()

	if err != nil {
		log.Printf("Database error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to retrieve properties",
			"details": "Database operation failed",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"count":      len(apartments),
		"properties": apartments,
	})
}

func AddHousingHandler(c *gin.Context) {
	var property housing.Housing
	if err := c.ShouldBindJSON(&property); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid JSON data"})
		return
	}

	_, err := database.MongoDB.GetProperty(strconv.Itoa(property.ID))
	if err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Property with id already exists"})
		return
	}

	err = database.MongoDB.StoreProperty(&property)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to store property data"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Property stored successfully!"})
}

func UpdateHousingHandler(c *gin.Context) {
	var property housing.Housing
	if err := c.ShouldBindJSON(&property); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid JSON data"})
		return
	}

	_, err := database.MongoDB.GetProperty(strconv.Itoa(property.ID))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid update"})
		return
	}

	err = database.MongoDB.DeleteProperty(strconv.Itoa(property.ID))
	if err != nil {
		log.Printf("Database error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to update properties",
			"details": "Database operation failed",
		})
		return
	}
	err = database.MongoDB.StoreProperty(&property)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to update property data"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Property updated successfully!"})

}

func DeleteHousingHandler(c *gin.Context) {
	query := c.Param("query")
	err := database.MongoDB.DeleteProperty(query)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid delete"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Property deleted successfully!"})
}

func UploadImgHandler(c *gin.Context) {

	file, header, err := c.Request.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to get image"})
		return
	}
	defer file.Close()

	_, err = cloudinary.CloudinaryServiceInst.UploadImage(file, header.Filename)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload image to Cloudinary"})
		return
	}

	c.Status(http.StatusOK)
}

func sortByDistanceHandler(c *gin.Context) {
	university := c.Query("university")
	if university == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "University name is required"})
		return
	}

	apartmentList, err := database.MongoDB.GetAllProperties()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch apartments"})
		return
	}

	if len(apartmentList) == 0 {
		c.JSON(http.StatusOK, gin.H{"message": "No apartments found"})
		return
	}

	var destinations []string
	for _, apartment := range apartmentList {
		destinations = append(destinations, apartment.Address)
	}

	distances, err := getDistances(university, destinations)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to calculate distances"})
		return
	}

	type ApartmentWithDistance struct {
		Property housing.Housing
		Distance float64
	}
	var apartmentsWithDistance []ApartmentWithDistance

	for i, apartment := range apartmentList {
		if i < len(distances) {
			distanceInMeters := distances[i]

			log.Printf("Apartment %s is %.2f km away from the university", apartment.Name, distanceInMeters/1000)

			apartmentsWithDistance = append(apartmentsWithDistance, ApartmentWithDistance{
				Property: apartment,
				Distance: distanceInMeters,
			})
		}
	}

	sort.Slice(apartmentsWithDistance, func(i, j int) bool {
		return apartmentsWithDistance[i].Distance < apartmentsWithDistance[j].Distance
	})

	var sortedProperties []housing.Housing
	for _, apt := range apartmentsWithDistance {
		sortedProperties = append(sortedProperties, apt.Property)
	}

	c.JSON(http.StatusOK, sortedProperties)
}

func getDistances(origin string, destinations []string) ([]float64, error) {
	apiKey := "AIzaSyCJbMwl9Jpmbhx863HaRaQDu7iSMPjiK9Y"
	destString := url.QueryEscape(strings.Join(destinations, "|"))
	apiURL := fmt.Sprintf(
		"https://maps.googleapis.com/maps/api/distancematrix/json?origins=%s&destinations=%s&key=%s",
		url.QueryEscape(origin), destString, apiKey,
	)

	log.Printf("API URL: %s\n", apiURL)

	resp, err := http.Get(apiURL)
	if err != nil || resp.StatusCode != http.StatusOK {
		log.Printf("Failed to call Google Distance Matrix API: %v", err)
		return nil, fmt.Errorf("failed to fetch distances")
	}
	defer resp.Body.Close()
	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		log.Printf("Failed to parse Google Distance Matrix API response: %v", err)
		return nil, fmt.Errorf("failed to parse response")
	}

	log.Printf("API Response: %+v\n", result)

	var distances []float64
	rows, ok := result["rows"].([]interface{})
	if !ok {
		return nil, fmt.Errorf("invalid response format")
	}
	for _, row := range rows {
		rowMap, ok := row.(map[string]interface{})
		if !ok {
			continue
		}

		elements, ok := rowMap["elements"].([]interface{})
		if !ok {
			continue
		}

		for i, element := range elements {
			elementMap, ok := element.(map[string]interface{})
			if !ok {
				log.Printf("Skipping element %d: invalid format", i)
				continue
			}

			status, ok := elementMap["status"].(string)
			if !ok || status != "OK" {
				log.Printf("Skipping element %d: status=%s", i, status)
				continue
			}

			distanceMap, ok := elementMap["distance"].(map[string]interface{})
			if !ok {
				log.Printf("Skipping element %d: missing distance", i)
				continue
			}

			distanceValue, ok := distanceMap["value"].(float64)
			if ok {
				distances = append(distances, distanceValue)
				log.Printf("Added distance for element %d: %.2f meters", i, distanceValue)
			}
		}
	}

	log.Printf("Final Distances: %+v\n", distances)

	return distances, nil
}

func filterRatingsHandler(c *gin.Context) {
	properties, err := database.MongoDB.GetPropertiesSortedByRating()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching properties"})
		return
	}

	c.JSON(http.StatusOK, properties)
}

func queryGPT(inputText string) {
	apiKey := os.Getenv("OPENAI_KEY")
	client := resty.New()

	response, err := client.R().
		SetAuthToken(apiKey).
		SetHeader("Content-Type", "application/json").
		SetBody(map[string]interface{}{
			"model":      "gpt-4o",
			"messages":   []interface{}{map[string]interface{}{"role": "system", "content": "Summarize the below text to 4 or less sentences. " + inputText}},
			"max_tokens": 5000,
		}).
		Post(apiEndpoint)

	if err != nil {
		log.Fatalf("Error while sending send the request: %v", err)
	}

	body := response.Body()

	var data map[string]interface{}
	err = json.Unmarshal(body, &data)
	if err != nil {
		fmt.Println("Error while decoding JSON response:", err)
		return
	}

	fmt.Println(data)

	// Extract the content from the JSON response
	content := data["choices"].([]interface{})[0].(map[string]interface{})["message"].(map[string]interface{})["content"].(string)
	fmt.Println(content)
}

// func ReviewSummarizerHandler(c *gin.Context) {
// 	query := c.Param("query")

// 	fmt.Println(query)

// 	commentsApartment, err := GetAllCommentsForApartmentHelper(query)

// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching property comments"})
// 		return
// 	}

// 	commentsCombined := ""

// 	for _, val := range commentsApartment {
// 		commentsCombined += val
// 		commentsCombined += ". "
// 	}
// 	// textB, _ := os.ReadFile("/Users/rohitbogulla/Desktop/Sem 2/SE/Gat-o-Buddy/apis/housing/file.txt")
// 	// text := string(textB)

// 	// queryGPT(text)

// 	// res := housing.CreateFromText(text)

// 	// summary, err := housing.BasicSummarizer(commentsCombined, 2)

// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching properties"})
// 		return
// 	}

// 	// summarized := rephraseSentences(strings.Split(summary, "\n"))

// 	c.JSON(http.StatusOK, gin.H{"message": summary})
// }

func fetchNearbyPlaces(location string, placeType string) ([]map[string]string, error) {
	apiKey := "AIzaSyCJbMwl9Jpmbhx863HaRaQDu7iSMPjiK9Y"
	apiURL := fmt.Sprintf(
		"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=%s&radius=1500&type=%s&key=%s",
		url.QueryEscape(location), url.QueryEscape(placeType), apiKey,
	)

	resp, err := http.Get(apiURL)
	if err != nil || resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed API call")
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("failed to decode response")
	}

	results, ok := result["results"].([]interface{})
	if !ok {
		return nil, fmt.Errorf("invalid response format")
	}

	var places []map[string]string
	for _, r := range results {
		rMap, ok := r.(map[string]interface{})
		if !ok {
			continue
		}

		name := rMap["name"]
		vicinity := rMap["vicinity"]
		place := map[string]string{
			"name":     fmt.Sprintf("%v", name),
			"vicinity": fmt.Sprintf("%v", vicinity),
		}
		places = append(places, place)
	}

	return places, nil
}

func GetNearbyAmenitiesHandler(c *gin.Context) {
	query := c.Param("query")

	// Fetch property to get address or lat/lng
	property, err := database.MongoDB.GetProperty(query)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Property not found"})
		return
	}

	location := fmt.Sprintf("%f,%f", property.Lat, property.Lng)
	types := []string{"restaurant", "gym", "supermarket", "cafe"}

	amenities := make(map[string][]map[string]string)

	for _, placeType := range types {
		places, err := fetchNearbyPlaces(location, placeType)
		if err != nil {
			log.Printf("Failed to fetch %s: %v", placeType, err)
			continue
		}
		amenities[placeType] = places
	}

	c.JSON(http.StatusOK, gin.H{"amenities": amenities})
}
