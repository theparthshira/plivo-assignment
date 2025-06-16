package service

import (
	"database/sql"
	"fmt"

	"github.com/theparthshira/plivo-assignment/internal/models"
)

type OrganisationService interface {
	CreateOrganisation(organisation *models.Organisations) error
	AddMemberToOrganisation(member *models.Members) error
	UpdateOrganisation(organisation *models.Organisations) error
	GetOrganisationByOrgID(org_id int) (*models.Organisations, error)
}

type mysqlOrganisationService struct {
	db *sql.DB
}

// NewMySQLUserService creates a new MySQL user repository.
func NewMySQLOrganisationService(db *sql.DB) OrganisationService {
	return &mysqlOrganisationService{db: db}
}

func (r *mysqlOrganisationService) CreateOrganisation(organisation *models.Organisations) error {
	query := "INSERT INTO organisations (name, created_by) VALUES (?, ?)"
	result, err := r.db.Exec(query, organisation.Name, organisation.CreatedBy)

	if err != nil {
		return fmt.Errorf("error creating organisation: %w", err)
	}

	lastInsertID, err := result.LastInsertId()

	if err != nil {
		return fmt.Errorf("error getting last insert ID: %w", err)
	}

	organisation.ID = int(lastInsertID)
	return nil
}

func (r *mysqlOrganisationService) GetOrganisationByOrgID(org_id int) (*models.Organisations, error) {
	query := "SELECT * FROM organisations WHERE id = ?"
	row := r.db.QueryRow(query, org_id)

	organisation := &models.Organisations{}
	err := row.Scan(&organisation.ID, &organisation.Name, &organisation.CreatedBy, &organisation.CreatedAt, &organisation.UpdatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // User not found
		}
		return nil, fmt.Errorf("error getting user by ID: %w", err)
	}

	return organisation, nil
}

func (r *mysqlOrganisationService) AddMemberToOrganisation(member *models.Members) error {
	fmt.Println(member.UserID, member.OrgID, member.MemberType)
	query := "INSERT INTO members (user_id, org_id, member_type) VALUES (?, ?, ?)"
	_, err := r.db.Exec(query, member.UserID, member.OrgID, member.MemberType)

	if err != nil {
		return fmt.Errorf("error creating member: %w", err)
	}

	return nil
}

func (r *mysqlOrganisationService) UpdateOrganisation(organisation *models.Organisations) error {
	query := "UPDATE organisations SET name = ? WHERE id = ?"
	_, err := r.db.Exec(query, organisation.Name, organisation.ID)

	if err != nil {
		return fmt.Errorf("error updating user: %w", err)
	}

	return nil
}
