package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"github.com/theparthshira/plivo-assignment/internal/api"
	"github.com/theparthshira/plivo-assignment/internal/db"
)

func main() {
	godotenv.Load()
	mysqlDSN := "root:admin@tcp(127.0.0.1:3306)/plivo_status?parseTime=true"
	// mysqlDSN := os.Getenv("MYSQL_DSN")
	if mysqlDSN == "" {
		log.Fatal("MYSQL_DSN environment variable not set. Please provide database connection string.")
	}

	DB, err := db.InitDB(mysqlDSN)

	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	defer db.CloseDB()

	// Initialize a new Gorilla Mux router
	r := mux.NewRouter()

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
		Debug:            true,
	})

	handler := c.Handler(r)

	api.RegisterAdminAPIRoutes(r, DB)
	api.RegisterClientAPIRoutes(r, DB)

	// Configure the HTTP server
	server := &http.Server{
		Addr:         ":8080",
		Handler:      handler,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		fmt.Printf("Starting server on %s\n", server.Addr)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Could not listen on %s: %v\n", server.Addr, err)
		}
	}()

	<-quit
	log.Println("Shutting down server...")

	// Create a context with a timeout for server shutdown
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// Attempt to gracefully shut down the server
	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("Server exiting gracefully.")
}
