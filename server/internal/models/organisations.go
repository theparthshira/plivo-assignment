package models

import "time"

type Organisations struct {
	ID        int       `json:"id"`         // Primary key, auto-incrementing
	Name      string    `json:"name"`       // Organisation name
	CreatedBy int       `json:"created_by"`    // Creator user id
	CreatedAt time.Time `json:"created_at"` // Timestamp when the record was created
	UpdatedAt time.Time `json:"updated_at"` // Timestamp when the record was last updated
}
