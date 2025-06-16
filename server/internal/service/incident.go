package service

import (
	"database/sql"
	"fmt"

	"github.com/theparthshira/plivo-assignment/internal/models"
)

type IncidentService interface {
	AddNewIncident(incident *models.Incidents) error
	AddIncidentComment(comment *models.IncidentComment) error
	GetIncidentsFromServiceID(service_id int) ([]models.Incidents, error)
	GetIncidentCommentsFromIncidentID(incident_id int) ([]models.IncidentComment, error)
	GetIncidentsFromOrgID(org_id int) ([]models.Incidents, error)
	UpdateIncident(incident *models.Incidents) error
	GetIncidentDetail(id int) (*models.Incidents, error)
}

type mysqlIncidentService struct {
	db *sql.DB
}

func NewMySQLIncidentService(db *sql.DB) IncidentService {
	return &mysqlIncidentService{db: db}
}

func (r *mysqlIncidentService) AddNewIncident(incident *models.Incidents) error {
	query := "INSERT INTO incidents (service_type, description, service_id, org_id) VALUES (?, ?, ?, ?)"
	_, err := r.db.Exec(query, incident.ServiceType, incident.Description, incident.ServiceID, incident.OrgID)

	if err != nil {
		return fmt.Errorf("error creating user: %w", err)
	}

	return nil
}

func (r *mysqlIncidentService) AddIncidentComment(comment *models.IncidentComment) error {
	query := "INSERT INTO incident_comment (incident_id, comment, comment_by) VALUES (?, ?, ?)"
	_, err := r.db.Exec(query, comment.IncidentID, comment.Comment, comment.CommentBy)

	if err != nil {
		return fmt.Errorf("error creating user: %w", err)
	}

	return nil
}

func (r *mysqlIncidentService) GetIncidentsFromServiceID(service_id int) ([]models.Incidents, error) {
	query := "SELECT * FROM incidents where service_id = ?"
	rows, err := r.db.Query(query, service_id)

	if err != nil {
		return nil, fmt.Errorf("error getting all incidents: %w", err)
	}

	var incidents []models.Incidents

	for rows.Next() {
		incident := models.Incidents{}

		if err := rows.Scan(
			&incident.ID,
			&incident.IncidentStatus,
			&incident.ServiceType,
			&incident.Description,
			&incident.ServiceID,
			&incident.OrgID,
			&incident.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("error scanning incident row: %w", err)
		}

		incidents = append(incidents, incident)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating over incident rows: %w", err)
	}

	return incidents, nil
}

func (r *mysqlIncidentService) GetIncidentCommentsFromIncidentID(incident_id int) ([]models.IncidentComment, error) {
	query := "SELECT * FROM incident_comment where incident_id = ?"
	rows, err := r.db.Query(query, incident_id)

	if err != nil {
		return nil, fmt.Errorf("error getting all comments: %w", err)
	}

	var comments []models.IncidentComment

	for rows.Next() {
		comment := models.IncidentComment{}

		if err := rows.Scan(
			&comment.ID,
			&comment.IncidentID,
			&comment.Comment,
			&comment.CommentBy,
			&comment.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("error scanning comment row: %w", err)
		}

		comments = append(comments, comment)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating over comment rows: %w", err)
	}

	return comments, nil
}

func (r *mysqlIncidentService) GetIncidentsFromOrgID(org_id int) ([]models.Incidents, error) {
	query := "SELECT * FROM incidents where org_id = ?"
	rows, err := r.db.Query(query, org_id)

	if err != nil {
		return nil, fmt.Errorf("error getting all incidents: %w", err)
	}

	var incidents []models.Incidents

	for rows.Next() {
		incident := models.Incidents{}

		if err := rows.Scan(
			&incident.ID,
			&incident.IncidentStatus,
			&incident.ServiceType,
			&incident.Description,
			&incident.ServiceID,
			&incident.OrgID,
			&incident.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("error scanning incident row: %w", err)
		}

		incidents = append(incidents, incident)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating over incident rows: %w", err)
	}

	return incidents, nil
}

func (r *mysqlIncidentService) UpdateIncident(incident *models.Incidents) error {
	query := "UPDATE incidents SET incident_status = ?, description = ? WHERE id = ?"
	_, err := r.db.Exec(query, incident.IncidentStatus, incident.Description, incident.ID)

	if err != nil {
		return fmt.Errorf("error updating user: %w", err)
	}

	return nil
}

func (r *mysqlIncidentService) GetIncidentDetail(id int) (*models.Incidents, error) {
	query := "SELECT * FROM incidents WHERE id = ?"
	row := r.db.QueryRow(query, id)

	incident := &models.Incidents{}
	err := row.Scan(&incident.ID, &incident.IncidentStatus, &incident.ServiceType, &incident.Description, &incident.ServiceID, &incident.OrgID, &incident.CreatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // User not found
		}
		return nil, fmt.Errorf("error getting user by ID: %w", err)
	}

	return incident, nil
}
