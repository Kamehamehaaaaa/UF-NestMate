package database

import (
	"context"
	"errors"
	"log"
	"strconv"

	"fmt"
	"time"

	"apis/comments"
	"apis/housing"
	"apis/user"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
)

var MongoDB *MongoDBService

type MongoDBService struct {
	client *mongo.Client
	db     *mongo.Database
}

func NewMongoDBService() *MongoDBService {
	//clientOptions := options.Client().ApplyURI("mongodb://192.168.0.74:27017")
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

func NewMongoDBTestService() *MongoDBService {
	//clientOptions := options.Client().ApplyURI("mongodb://192.168.0.74:27017")
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}

	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatalf("Failed to ping MongoDB: %v", err)
	}

	db := client.Database("UF_NestMate_unittests")
	return &MongoDBService{client: client, db: db}
}

func (m *MongoDBService) RegisterUser(user *user.User) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Password hashing error: %v", err)
		return err
	}
	user.Password = string(hashedPassword)

	// Insert user into database
	_, err = m.db.Collection("users").InsertOne(ctx, user)
	if err != nil {
		log.Printf("MongoDB insert error: %v", err)
		return err
	}

	return nil
}

func (m *MongoDBService) getNextID() (int, error) {
	var lastProperty housing.Housing
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

func (m *MongoDBService) StoreProperty(property *housing.Housing) error {
	id, err := m.getNextID()
	if err != nil {
		return err
	}
	property.ID = id

	_, err = m.db.Collection("apartment_card").InsertOne(context.Background(), property)
	return err
}

func (m *MongoDBService) GetProperty(query string) (*housing.Housing, error) {
	var property housing.Housing
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

func (m *MongoDBService) DeleteProperty(query string) error {
	var property housing.Housing
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
		return err
	}

	err = m.db.Collection("apartment_card").Drop(context.Background())
	if err != nil {
		return err
	}

	return nil
}

func (m *MongoDBService) GetAllProperties() ([]housing.Housing, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := m.db.Collection("apartment_card").Find(ctx, bson.D{})
	if err != nil {
		log.Printf("MongoDB find error: %v", err)
		return nil, err
	}
	defer cursor.Close(ctx)

	var properties []housing.Housing
	if err = cursor.All(ctx, &properties); err != nil {
		log.Printf("Cursor decode error: %v", err)
		return nil, err
	}

	if len(properties) == 0 {
		log.Println("No properties found in collection")
		return []housing.Housing{}, nil
	}

	return properties, nil
}

func (m *MongoDBService) StoreUser(user *user.User) error {
	_, err := m.db.Collection("users").InsertOne(context.Background(), user)
	if err != nil {
		return err
	}
	return nil
}

// Add to MongoDBService methods
func (m *MongoDBService) AddComment(apartmentID int, comment string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.D{{"id", apartmentID}}
	update := bson.D{
		{"$push", bson.D{
			{"comments", comment},
		}},
	}

	result, err := m.db.Collection("apartment_card").UpdateOne(ctx, filter, update)
	if err != nil {
		return err
	}

	if result.MatchedCount == 0 {
		return errors.New("apartment not found")
	}

	return nil
}

func (m *MongoDBService) GetUserByUsername(username string) (*user.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user user.User
	err := m.db.Collection("users").FindOne(ctx, bson.M{"username": username}).Decode(&user)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("database error: %v", err)
	}
	return &user, nil
}

func (m *MongoDBService) DeleteComment(query string) error {
	// var filter bson.D

	// idNum, err := strconv.Atoi(query)
	// if err == nil {
	// 	filter = bson.D{{"id", idNum}}
	// } else {
	// 	return fmt.Errorf("database error: %v", err)
	// }

	// err = m.db.Collection("apartment_card").Drop(context.Background())
	// if err != nil {
	// 	return err
	// }

	return nil
}

func (m *MongoDBService) GetComment(query string) (*comments.Comments, error) {
	// var filter bson.D

	// idNum, err := strconv.Atoi(query)
	// if err == nil {
	// 	filter = bson.D{{"id", idNum}}
	// } else {
	// 	return fmt.Errorf("database error: %v", err)
	// }

	// err = m.db.Collection("apartment_card").Drop(context.Background())
	// if err != nil {
	// 	return err
	// }

	return nil, nil
}

func (m *MongoDBService) UpdateUser(username string, updatedUser user.User) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{"username": username} // Filter by username
	update := bson.M{
		"$set": bson.M{
			"firstName": updatedUser.FirstName,
			"lastName":  updatedUser.LastName,
			"email":     updatedUser.Username,
		},
	}

	result, err := m.db.Collection("users").UpdateOne(ctx, filter, update)
	if err != nil {
		return fmt.Errorf("database error: %v", err)
	}

	if result.MatchedCount == 0 {
		return fmt.Errorf("user not found")
	}

	return nil
}

func (m *MongoDBService) GetPropertiesSortedByRating() ([]housing.Housing, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	opts := options.Find().SetSort(bson.D{{"rating", -1}})
	cursor, err := m.db.Collection("apartment_card").Find(ctx, bson.D{}, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var properties []housing.Housing
	if err = cursor.All(ctx, &properties); err != nil {
		return nil, err
	}

	return properties, nil
}

func (m *MongoDBService) GetAllCommentsForApartment(query string) ([]string, error) {
	var property housing.Housing
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
	return property.Comments, nil
}

func (m *MongoDBService) DeleteUser(username string) error {
	var user user.User

	filter := bson.M{"username": username} // Filter by username

	err := m.db.Collection("users").FindOne(context.Background(), filter).Decode(&user)
	if err != nil {
		return err
	}

	err = m.db.Collection("users").Drop(context.Background())
	if err != nil {
		return err
	}

	return nil
}


// AddFavorite adds an apartment ID to user's favorites
func (m *MongoDBService) AddFavorite(username string, aptID int) error {
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    _, err := m.db.Collection("users").UpdateOne(
        ctx,
        bson.M{"username": username},
        bson.M{"$addToSet": bson.M{"favorites": aptID}},
    )
    return err
}

// RemoveFavorite removes an apartment ID from user's favorites
func (m *MongoDBService) RemoveFavorite(username string, aptID int) error {
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    _, err := m.db.Collection("users").UpdateOne(
        ctx,
        bson.M{"username": username},
        bson.M{"$pull": bson.M{"favorites": aptID}},
    )
    return err
}

// GetFavorites retrieves user's favorite apartments
func (m *MongoDBService) GetFavorites(username string) ([]housing.Housing, error) {
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    var user user.User
    err := m.db.Collection("users").FindOne(ctx, bson.M{"username": username}).Decode(&user)
    if err != nil {
        return nil, err
    }

    var favorites []housing.Housing
    for _, aptID := range user.Favorites {
        apt, err := m.GetProperty(strconv.Itoa(aptID))
        if err == nil {
            favorites = append(favorites, *apt)
        }
    }
    
    return favorites, nil
}


func (m *MongoDBService) SavePreferences(username string, preferences user.Preferences) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{"username": username}
	update := bson.M{"$set": bson.M{"preferences": preferences}}

	result, err := m.db.Collection("users").UpdateOne(ctx, filter, update)
	if err != nil || result.MatchedCount == 0 {
		return errors.New("failed to update preferences or user not found")
	}

	return nil
}

func (m *MongoDBService) GetPreferences(username string) (*user.Preferences, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user user.User
	err := m.db.Collection("users").FindOne(ctx, bson.M{"username": username}).Decode(&user)
	if err != nil {
		return nil, err
	}

	return user.Preferences, nil
}



func (m *MongoDBService) GetAllUsers() ([]user.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := m.db.Collection("users").Find(ctx, bson.D{})
	if err != nil {
		log.Printf("MongoDB find error: %v", err)
		return nil, err
	}
	defer cursor.Close(ctx)

	var users []user.User
	if err = cursor.All(ctx, &users); err != nil {
		log.Printf("Cursor decode error: %v", err)
		return nil, err
	}

	return users, nil
}
