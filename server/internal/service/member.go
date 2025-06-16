package service

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/joho/godotenv"
	"github.com/theparthshira/plivo-assignment/internal/models"
	"github.com/theparthshira/plivo-assignment/pkg"
)

type MemberService interface {
	AddMemberToOrganisation(member *models.Members) error
	RemoveMemberFromOrganisation(member_id int) error
	GetOrganisationMembers(id int) ([]MemberList, error)
	GetUserByEmail(email string) (*models.User, error)
	CreateUser(user *models.User) error
}

type MemberList struct {
	ID         int
	MemberType string
	CreatedAt  time.Time
	Email      string
}

type mysqlMemberService struct {
	db *sql.DB
}

func NewMySQLMemberService(db *sql.DB) MemberService {
	return &mysqlMemberService{db: db}
}

func (r *mysqlMemberService) AddMemberToOrganisation(member *models.Members) error {
	query := "INSERT INTO members (user_id, org_id, member_type) VALUES (?, ?, ?)"
	_, err := r.db.Exec(query, member.UserID, member.OrgID, member.MemberType)

	if err != nil {
		return fmt.Errorf("error creating user: %w", err)
	}

	return nil
}

func (r *mysqlMemberService) GetOrganisationMembers(id int) ([]MemberList, error) {
	query := "SELECT M.id, M.member_type, M.created_at, U.email from members AS M JOIN users AS U ON M.user_id = U.id WHERE M.org_id = ?"
	rows, err := r.db.Query(query, id)

	if err != nil {
		return nil, fmt.Errorf("error getting all members: %w", err)
	}

	var members []MemberList

	for rows.Next() {
		member := MemberList{}

		if err := rows.Scan(&member.ID, &member.MemberType, &member.CreatedAt, &member.Email); err != nil {
			return nil, fmt.Errorf("error scanning member row: %w", err)
		}
		members = append(members, member)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating over member rows: %w", err)
	}

	return members, nil
}

func (r *mysqlMemberService) RemoveMemberFromOrganisation(member_id int) error {
	query := "DELETE FROM members WHERE id = ?"
	_, err := r.db.Exec(query, member_id)

	if err != nil {
		return fmt.Errorf("error creating user: %w", err)
	}

	return nil
}

func (r *mysqlMemberService) GetUserByEmail(email string) (*models.User, error) {
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

func (r *mysqlMemberService) CreateUser(user *models.User) error {
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

	password, _ := pkg.GeneratePassword()

	CreateClerkUser(user, password)

	pkg.Send(user.Email, "New member created!", `
		<div>
		Hello there, 
		<br/>
		<br/>
		Here is your new account credentials: 
		<br/>
		Email: `+user.Email+
		`<br/>
		Password: `+password+
		`<br/>
		<br/>
		Regards,
		<br/>
		Parth
		</div>
		`)

	return nil
}

func CreateClerkUser(user *models.User, password string) {
	godotenv.Load()
	url := "https://api.clerk.com/v1/users"

	parts := strings.Split(user.Name, " ")

	first_name := ""
	last_name := ""

	if len(parts) > 1 {
		first_name = parts[0]
		last_name = parts[1]
	} else if len(parts) > 0 {
		first_name = parts[0]
		last_name = ""
	} else {
		first_name = ""
		last_name = ""
	}

	requestBodyMap := map[string]interface{}{
		"email_address": []string{user.Email},
		"password":      password,
		"first_name":    first_name,
		"last_name":     last_name,
	}

	jsonBody, err := json.Marshal(requestBodyMap)
	if err != nil {
		fmt.Printf("Error marshalling JSON: %s\n", err)
		return
	}

	client := &http.Client{}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonBody))
	if err != nil {
		fmt.Printf("Error creating request: %s\n", err)
		return
	}

	clerk_secret := os.Getenv("CLERK_SECRET")

	fmt.Println("secret", clerk_secret)

	req.Header.Set("Authorization", "Bearer "+clerk_secret)

	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)

	defer resp.Body.Close()

	responseBody, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("Error reading response body: %s\n", err)
		return
	}

	fmt.Printf("Response Status: %s\n", resp.Status)
	fmt.Printf("Response Body: %s\n", string(responseBody))
}
