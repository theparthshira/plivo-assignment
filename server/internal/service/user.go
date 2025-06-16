package service

import (
	"database/sql"
	"fmt"

	"github.com/theparthshira/plivo-assignment/internal/models"
)

// UserRepository defines the interface for user data operations.
type UserService interface {
	CreateUser(user *models.User) error
	GetUserByEmail(email string) (*models.User, error)
	GetAllUsers() ([]models.User, error)
	GetOrgsByUserID(id int) ([]models.Organisations, error)
	GetRoleByUserIDOrgID(org_id int, user_id int) (*models.Members, error)
}

// mysqlUserService implements UserRepository for MySQL.
type mysqlUserService struct {
	db *sql.DB
}

// NewMySQLUserService creates a new MySQL user repository.
func NewMySQLUserService(db *sql.DB) UserService {
	return &mysqlUserService{db: db}
}

// CreateUser inserts a new user into the database.
func (r *mysqlUserService) CreateUser(user *models.User) error {
	query := "INSERT INTO users (name, email) VALUES (?, ?)"
	result, err := r.db.Exec(query, user.Name, user.Email)
	if err != nil {
		return fmt.Errorf("error creating user: %w", err)
	}
	lastInsertID, err := result.LastInsertId()
	if err != nil {
		return fmt.Errorf("error getting last insert ID: %w", err)
	}
	user.ID = int(lastInsertID)
	return nil
}

// GetUserByEmail retrieves a user by their ID.
func (r *mysqlUserService) GetUserByEmail(email string) (*models.User, error) {
	query := "SELECT id, name, email FROM users WHERE email = ?"
	row := r.db.QueryRow(query, email)

	user := &models.User{}
	err := row.Scan(&user.ID, &user.Name, &user.Email)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // User not found
		}
		return nil, fmt.Errorf("error getting user by ID: %w", err)
	}

	return user, nil
}

// GetAllUsers retrieves all users from the database.
func (r *mysqlUserService) GetAllUsers() ([]models.User, error) {
	query := "SELECT id, name, email FROM users"
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("error getting all users: %w", err)
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		user := models.User{}
		if err := rows.Scan(&user.ID, &user.Name, &user.Email); err != nil {
			return nil, fmt.Errorf("error scanning user row: %w", err)
		}
		users = append(users, user)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating over user rows: %w", err)
	}
	return users, nil
}

func (r *mysqlUserService) GetOrgsByUserID(id int) ([]models.Organisations, error) {
	query := "SELECT O.* from organisations AS O JOIN members AS M ON O.id = M.org_id WHERE M.user_id = ?"
	rows, err := r.db.Query(query, id)

	if err != nil {
		return nil, fmt.Errorf("error getting all organisations: %w", err)
	}

	var organisations []models.Organisations

	for rows.Next() {
		organisation := models.Organisations{}

		if err := rows.Scan(&organisation.ID, &organisation.Name, &organisation.CreatedBy, &organisation.CreatedAt, &organisation.UpdatedAt); err != nil {
			return nil, fmt.Errorf("error scanning organisation row: %w", err)
		}
		organisations = append(organisations, organisation)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating over organisation rows: %w", err)
	}

	return organisations, nil
}

func (r *mysqlUserService) GetRoleByUserIDOrgID(org_id int, user_id int) (*models.Members, error) {
	query := "SELECT * from members WHERE org_id = ? AND user_id = ?"
	row := r.db.QueryRow(query, org_id, user_id)

	member := &models.Members{}
	err := row.Scan(&member.ID, &member.OrgID, &member.UserID, &member.MemberType, &member.CreatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // User not found
		}
		return nil, fmt.Errorf("error getting user by ID: %w", err)
	}

	return member, nil
}
