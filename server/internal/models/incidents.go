package models

import "time"

type Incidents struct {
	ID             int       `json:"id"`              // Primary key, auto-incrementing
	IncidentStatus string    `json:"incident_status"` // Incident Status
	ServiceType    string    `json:"service_type"`    // Service Type
	Description    string    `json:"description"`     // Description
	ServiceID      int       `json:"service_id"`      // Service ID
	OrgID          int       `json:"org_id"`          // Organisation ID
	CreatedAt      time.Time `json:"created_at"`      // Timestamp when the record was created
}
