// internal/db/database.go
package db

import (
	"crypto/tls"
	"crypto/x509"
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/go-sql-driver/mysql"
	_ "github.com/go-sql-driver/mysql"
)

// DB is the global database connection pool.
var DB *sql.DB

// InitDB initializes the database connection pool.
// It takes a DSN (Data Source Name) string for connecting to MySQL.
// Example DSN: "user:password@tcp(127.0.0.1:3306)/database_name?parseTime=true"
func InitDB() (*sql.DB, error) {
	var err error

	// --- Configure TLS with the downloaded CA certificate ---
	// Make sure "ca.pem" is in the same directory as your Go program,
	// or provide the full path to it.
	caCertPath := "ca.pem" // Path to your downloaded Aiven CA certificate

	rootCertPool := x509.NewCertPool()
	pem, err := os.ReadFile(caCertPath)
	if err != nil {
		log.Fatalf("Failed to read CA certificate from %s: %v", caCertPath, err)
	}
	if ok := rootCertPool.AppendCertsFromPEM(pem); !ok {
		log.Fatalf("Failed to append PEM to RootCAs.")
	}

	// Register a custom TLS configuration with the driver
	mysql.RegisterTLSConfig("custom_aiven_tls", &tls.Config{
		RootCAs: rootCertPool,
		// InsecureSkipVerify: false, // For production, keep this false or omit for default secure behavior
	})

	mysqlDSN := os.Getenv("MYSQL_DSN")

	DB, err = sql.Open("mysql", mysqlDSN) // "mysql" is the driver name registered by the imported package
	if err != nil {
		return nil, fmt.Errorf("error opening database: %w", err)
	}

	// Set connection pool properties (optional but recommended for performance and stability)
	DB.SetMaxOpenConns(25)                 // Maximum number of open connections to the database
	DB.SetMaxIdleConns(25)                 // Maximum number of connections in the idle connection pool
	DB.SetConnMaxLifetime(5 * time.Minute) // Maximum amount of time a connection may be reused

	// Ping the database to verify the connection is alive
	if err = DB.Ping(); err != nil {
		return nil, fmt.Errorf("error connecting to the database: %w", err)
	}

	log.Println("Database connection established successfully!")
	return DB, nil
}

// CloseDB closes the database connection pool.
// It should be called before your application exits.
func CloseDB() {
	if DB != nil {
		err := DB.Close()
		if err != nil {
			log.Printf("Error closing database connection: %v\n", err)
		} else {
			log.Println("Database connection closed.")
		}
	}
}
