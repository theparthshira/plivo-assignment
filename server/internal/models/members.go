package models

import "time"

type Members struct {
	ID         int       `json:"id"`          // Primary key, auto-incrementing
	UserID     int       `json:"user_id"`     // User ID
	OrgID      int       `json:"org_id"`      // Organisation ID
	MemberType string    `json:"member_type"` // Member Type
	CreatedAt  time.Time `json:"created_at"`  // Timestamp when the record was created
}
