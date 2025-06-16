package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/theparthshira/plivo-assignment/internal/models"
	"github.com/theparthshira/plivo-assignment/internal/service"
)

// UserHandler handles HTTP requests related to users.
type UserHandler struct {
	userService service.UserService
}

// NewUserHandler creates a new UserHandler.
func NewUserHandler(userService service.UserService) *UserHandler {
	return &UserHandler{userService: userService}
}

func (h *UserHandler) SignInHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email string
		Name  string
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload: "+err.Error(), http.StatusBadRequest)
		return
	}

	if req.Email == "" {
		http.Error(w, "Email is required for sign-in", http.StatusBadRequest)
		return
	}

	user, err := h.userService.GetUserByEmail(req.Email)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	if user == nil {
		if req.Name == "" {
			http.Error(w, "Name is required for sign-up", http.StatusBadRequest)
		}

		newUser := &models.User{
			Name:  req.Name,
			Email: req.Email,
		}

		if err := h.userService.CreateUser(newUser); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}

		user = newUser
	}

	// 3. If user does not exist, create a new one

	organisations, err := h.userService.GetOrgsByUserID(user.ID)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	response := struct {
		Organisations []models.Organisations
		User          models.User
	}{
		Organisations: organisations,
		User:          *user,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK) // Return 200 OK whether getting or creating
	json.NewEncoder(w).Encode(response)
}

func (h *UserHandler) GetUserOrganisationsHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	id, err := strconv.Atoi(vars["id"])

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	if id <= 0 {
		http.Error(w, "OrgID is required", http.StatusBadRequest)
		return
	}

	organisations, err := h.userService.GetOrgsByUserID(id)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK) // Return 200 OK whether getting or creating
	json.NewEncoder(w).Encode(organisations)
}

func (h *UserHandler) GetUserRoleHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	id, err := strconv.Atoi(vars["id"])

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	if id <= 0 {
		http.Error(w, "OrgID is required", http.StatusBadRequest)
		return
	}

	var req struct {
		OrgID int
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload: "+err.Error(), http.StatusBadRequest)
		return
	}

	if req.OrgID <= 0 {
		http.Error(w, "OrgID is required", http.StatusBadRequest)
		return
	}

	member, err := h.userService.GetRoleByUserIDOrgID(req.OrgID, id)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK) // Return 200 OK whether getting or creating
	json.NewEncoder(w).Encode(member)
}
