package main

import (
	"context"
	"errors"
	"log"
	"strconv"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type MongoDBService struct {
	client *mongo.Client
	db     *mongo.Database
}

type Property struct {
	ID          int      `json:"id" bson:"id"`
	Name        string   `json:"name" bson:"name"`
	Image       string   `json:"image" bson:"image"`
	Description string   `json:"description" bson:"description"`
	Address     string   `json:"address" bson:"address"`
	Vacancy     int      `json:"vacancy" bson:"vacancy"`
	Rating      float64  `json:"rating" bson:"rating"`
	Comments     []string `json:"comments" bson:"comments"`
}

func NewMongoDBService() *MongoDBService {
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}

	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatalf("Failed to ping MongoDB: %v", err)
	}

	db := client.Database("UF_NestMate")
	return &MongoDBService{client: client, db: db}
}

func (m *MongoDBService) getNextID() (int, error) {
	var lastProperty Property
	opts := options.FindOne().SetSort(bson.D{{"id", -1}})
	err := m.db.Collection("apartment_card").FindOne(context.Background(), bson.D{}, opts).Decode(&lastProperty)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return 1, nil // Start from 1 if no documents exist
		}
		return 0, err
	}
	return lastProperty.ID + 1, nil
}

func (m *MongoDBService) StoreProperty(property *Property) error {
	id, err := m.getNextID()
	if err != nil {
		return err
	}
	property.ID = id

	_, err = m.db.Collection("apartment_card").InsertOne(context.Background(), property)
	return err
}

func (m *MongoDBService) GetProperty(query string) (*Property, error) {
	var property Property
	var filter bson.D

	idNum, err := strconv.Atoi(query)
	if err == nil {
		filter = bson.D{{"$or", bson.A{
			bson.D{{"id", idNum}},  
			bson.D{{"name", query}}, 
		}}}
	} else {
		filter = bson.D{{"name", query}}
	}

	err = m.db.Collection("apartment_card").FindOne(context.Background(), filter).Decode(&property)
	if err != nil {
		return nil, err
	}

	return &property, nil
}

func (m *MongoDBService) StoreUser(user *User) error {
    _, err := m.db.Collection("users").InsertOne(context.Background(), user)
    if err != nil {
        return err
    }
    return nil
}