package models

import "time"

type ServiceMaintenance struct {
	ID              int       `json:"id"`               // Primary key, auto-incrementing
	ServiceID       int       `json:"service_id"`       // Service ID
	MaintenanceTime time.Time `json:"maintenance_time"` // Timestamp when the record was created
}
