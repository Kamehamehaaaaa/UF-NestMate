package main

import (
	"context"
	"log"
	"mime/multipart"
	"strings"
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

type CloudinaryService struct {
	client *cloudinary.Cloudinary
}

func NewCloudinaryService() *CloudinaryService {
	cld, err := cloudinary.NewFromURL(os.Getenv("CLOUDINARY_URL"))
	if err != nil {
		log.Fatalf("Failed to initialize Cloudinary: %v", err)
	}

	return &CloudinaryService{client: cld}
}

func (c *CloudinaryService) UploadImage(file multipart.File, filename string) (string, error) {
	publicID := strings.Split(filename, ".")[0]

	ctx := context.Background()
	uploadResult, err := c.client.Upload.Upload(ctx, file, uploader.UploadParams{
		PublicID: publicID,
	})
	if err != nil {
		log.Println("Cloudinary Upload Error:", err)
		return "", err
	}

	return uploadResult.SecureURL, nil
}