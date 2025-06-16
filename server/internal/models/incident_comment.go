package models

import "time"

type IncidentComment struct {
	ID         int       `json:"id"`          // Primary key, auto-incrementing
	IncidentID int       `json:"incident_id"` // Incident Status
	Comment    string    `json:"comment"`     // Incident Comment
	CommentBy  string    `json:"comment_by"`  // Comment By
	CreatedAt  time.Time `json:"created_at"`  // Timestamp when the record was created
}
