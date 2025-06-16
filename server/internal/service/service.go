package service

import (
	"database/sql"
	"fmt"

	"github.com/theparthshira/plivo-assignment/internal/models"
)

type ServiceService interface {
	GetAllServicesByOrgID(org_id int) ([]models.Services, error)
	CreateService(service *models.Services) error
	UpdateService(service *models.Services) error
	DeleteService(service_id int) error
	CreateServiceMaintenance(maintenance *models.ServiceMaintenance) error
	GetAllServiceMaintenanceByServiceID(service_id int) ([]models.ServiceMaintenance, error)
	DeleteServiceMaintenance(maintenance_id int) error
	GetServiceByID(id int) (*models.Services, error)
	GetServiceLogByID(id int) ([]models.ServiceLog, error)
}

type mysqlServiceService struct {
	db *sql.DB
}

func NewMySQLServiceService(db *sql.DB) ServiceService {
	return &mysqlServiceService{db: db}
}

func (r *mysqlServiceService) GetAllServicesByOrgID(org_id int) ([]models.Services, error) {
	query := "SELECT * FROM services where org_id = ?"
	rows, err := r.db.Query(query, org_id)

	if err != nil {
		return nil, fmt.Errorf("error getting all services: %w", err)
	}

	var services []models.Services

	for rows.Next() {
		service := models.Services{}

		if err := rows.Scan(
			&service.ID,
			&service.Name,
			&service.ServiceStatus,
			&service.ServiceType,
			&service.OrgID,
			&service.CreatedBy,
			&service.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("error scanning service row: %w", err)
		}

		services = append(services, service)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating over service rows: %w", err)
	}

	return services, nil
}

func (r *mysqlServiceService) CreateService(service *models.Services) error {
	query := "INSERT INTO services (name, service_type, org_id, created_by) VALUES (?, ?, ?, ?)"
	result, err := r.db.Exec(query, service.Name, service.ServiceType, service.OrgID, service.CreatedBy)

	if err != nil {
		return fmt.Errorf("error creating service: %w", err)
	}
	lastInsertID, err := result.LastInsertId()
	if err != nil {
		return fmt.Errorf("error getting last insert ID: %w", err)
	}

	service.ID = int(lastInsertID)
	return nil
}

func (r *mysqlServiceService) UpdateService(service *models.Services) error {
	query := "UPDATE services SET name = ?, service_type = ?, service_status = ? WHERE id = ?"
	_, err := r.db.Exec(query, service.Name, service.ServiceType, service.ServiceStatus, service.ID)

	query = "INSERT INTO service_log (service_id, service_status) VALUES (?, ?)"
	_, err = r.db.Exec(query, service.ID, service.ServiceStatus)

	if err != nil {
		return fmt.Errorf("error updating user: %w", err)
	}

	return nil
}

func (r *mysqlServiceService) DeleteService(service_id int) error {
	query := "DELETE FROM services WHERE id = ?"
	_, err := r.db.Exec(query, service_id)

	if err != nil {
		return fmt.Errorf("error updating user: %w", err)
	}

	return nil
}

func (r *mysqlServiceService) CreateServiceMaintenance(maintenance *models.ServiceMaintenance) error {
	query := "INSERT INTO service_maintenance (service_id, maintenance_time) VALUES (?, ?)"
	result, err := r.db.Exec(query, maintenance.ServiceID, maintenance.MaintenanceTime)

	if err != nil {
		return fmt.Errorf("error creating service: %w", err)
	}
	lastInsertID, err := result.LastInsertId()
	if err != nil {
		return fmt.Errorf("error getting last insert ID: %w", err)
	}

	maintenance.ID = int(lastInsertID)
	return nil
}

func (r *mysqlServiceService) GetAllServiceMaintenanceByServiceID(service_id int) ([]models.ServiceMaintenance, error) {
	query := "SELECT * FROM service_maintenance where service_id = ?"
	rows, err := r.db.Query(query, service_id)

	if err != nil {
		return nil, fmt.Errorf("error getting all maintencance: %w", err)
	}

	var maintenances []models.ServiceMaintenance

	for rows.Next() {
		maintenance := models.ServiceMaintenance{}

		if err := rows.Scan(
			&maintenance.ID,
			&maintenance.ServiceID,
			&maintenance.MaintenanceTime,
		); err != nil {
			return nil, fmt.Errorf("error scanning maintenance row: %w", err)
		}

		maintenances = append(maintenances, maintenance)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating over maintenance rows: %w", err)
	}

	return maintenances, nil
}

func (r *mysqlServiceService) DeleteServiceMaintenance(maintenance_id int) error {
	query := "DELETE FROM service_maintenance WHERE id = ?"
	_, err := r.db.Exec(query, maintenance_id)

	if err != nil {
		return fmt.Errorf("error updating user: %w", err)
	}

	return nil
}

func (r *mysqlServiceService) GetServiceByID(id int) (*models.Services, error) {
	query := "SELECT * FROM services WHERE id = ?"
	row := r.db.QueryRow(query, id)

	service := &models.Services{}
	err := row.Scan(&service.ID, &service.Name, &service.ServiceStatus, &service.ServiceType, &service.OrgID, &service.CreatedBy, &service.CreatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // User not found
		}
		return nil, fmt.Errorf("error getting user by ID: %w", err)
	}

	return service, nil
}

func (r *mysqlServiceService) GetServiceLogByID(id int) ([]models.ServiceLog, error) {
	query := "SELECT * FROM service_log WHERE service_id = ?"
	rows, err := r.db.Query(query, id)

	if err != nil {
		return nil, fmt.Errorf("error getting all logs: %w", err)
	}

	var logs []models.ServiceLog

	for rows.Next() {
		log := models.ServiceLog{}

		if err := rows.Scan(
			&log.ID,
			&log.ServiceID,
			&log.ServiceStatus,
			&log.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("error scanning log row: %w", err)
		}

		logs = append(logs, log)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating over log rows: %w", err)
	}

	return logs, nil
}
