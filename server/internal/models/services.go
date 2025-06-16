package models

import "time"

type Services struct {
	ID            int       `json:"id"`             // Primary key, auto-incrementing
	Name          string    `json:"name"`           // Service Name
	ServiceStatus string    `json:"service_status"` // Service Status
	ServiceType   string    `json:"service_type"`   // Service Type
	OrgID         int       `json:"org_id"`         // Organisation ID
	CreatedBy     int       `json:"user_id"`        // Creator user id
	CreatedAt     time.Time `json:"created_at"`     // Timestamp when the record was created
}
