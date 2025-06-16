package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/theparthshira/plivo-assignment/internal/models"
	"github.com/theparthshira/plivo-assignment/internal/service"
)

type MemberHandler struct {
	memberService service.MemberService
}

func NewMemberHandler(memberService service.MemberService) *MemberHandler {
	return &MemberHandler{memberService: memberService}
}

func (h *MemberHandler) AddOrganisationMemberHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		OrgID      int
		MemberType string
		Email      string
		Name       string
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload: "+err.Error(), http.StatusBadRequest)
		return
	}

	if req.OrgID <= 0 || req.Email == "" || req.Name == "" || req.MemberType == "" {
		http.Error(w, "OrgID, MemberType and CreatedBy is required for creating organisation", http.StatusBadRequest)
		return
	}

	user, err := h.memberService.GetUserByEmail(req.Email)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	if user == nil {
		newUser := &models.User{
			Name:  req.Name,
			Email: req.Email,
		}

		if err := h.memberService.CreateUser(newUser); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}

		user = newUser
	}

	newMember := &models.Members{
		UserID:     user.ID,
		OrgID:      req.OrgID,
		MemberType: req.MemberType,
	}

	if err := h.memberService.AddMemberToOrganisation(newMember); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(newMember)
}

func (h *MemberHandler) GetOrganisationMembersHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	id, err := strconv.Atoi(vars["id"])

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	if id <= 0 {
		http.Error(w, "MemberID is required", http.StatusBadRequest)
		return
	}

	members, err := h.memberService.GetOrganisationMembers(id)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(members)
}

func (h *MemberHandler) RemoveOrganisationMemberHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	id, err := strconv.Atoi(vars["id"])

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	if id <= 0 {
		http.Error(w, "MemberID is required", http.StatusBadRequest)
		return
	}

	if err := h.memberService.RemoveMemberFromOrganisation(id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode("OK")
}
