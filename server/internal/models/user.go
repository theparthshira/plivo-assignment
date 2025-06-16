package models

import "time"

type User struct {
	ID        int       `json:"id"`         // Primary key, auto-incrementing
	Name      string    `json:"name"`       // User name
	Email     string    `json:"email"`      // Unique email address
	CreatedAt time.Time `json:"created_at"` // Timestamp when the record was created
	UpdatedAt time.Time `json:"updated_at"` // Timestamp when the record was last updated
}
