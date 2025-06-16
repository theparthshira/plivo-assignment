package models

import "time"

type ServiceLog struct {
	ID            int       `json:"id"`             // Primary key, auto-incrementing
	ServiceID     int       `json:"service_id"`     // Service ID
	ServiceStatus string    `json:"service_status"` // Service Status
	CreatedAt     time.Time `json:"created_at"`     // Timestamp when the record was created
}
