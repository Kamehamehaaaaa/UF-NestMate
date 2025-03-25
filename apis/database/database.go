package database

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var client *mongo.Client
var housingCollection *mongo.Collection

func ConnectToMongoDB() {
	// Connection string
	uri := "mongodb://localhost:27017"
	clientOptions := options.Client().ApplyURI(uri)

	// Connect to MongoDB
	var err error
	client, err = mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	// Check the connection
	err = client.Ping(context.TODO(), nil)
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Connected to MongoDB!")

	// Get the collection
	housingCollection = client.Database("housingdb").Collection("NestMateData")
}

func GetHousingCollection() *mongo.Collection {
	return housingCollection
}

func CloseMongoDBConnection() {
	if err := client.Disconnect(context.TODO()); err != nil {
		log.Fatal(err)
	}
	log.Println("Disconnected from MongoDB!")
}
