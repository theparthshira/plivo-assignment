package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/theparthshira/plivo-assignment/internal/models"
	"github.com/theparthshira/plivo-assignment/internal/service"
)

type OrganisationHandler struct {
	organisationService service.OrganisationService
}

func NewOrganisationHandler(organisationService service.OrganisationService) *OrganisationHandler {
	return &OrganisationHandler{organisationService: organisationService}
}

func (h *OrganisationHandler) CreateOrganisationHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name       string
		CreatedBy  int
		MemberType string
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload: "+err.Error(), http.StatusBadRequest)
		return
	}

	if req.Name == "" || req.CreatedBy <= 0 {
		http.Error(w, "Name and CreatedyBy is required for creating organisation", http.StatusBadRequest)
		return
	}

	newOrganisation := &models.Organisations{
		Name:      req.Name,
		CreatedBy: req.CreatedBy,
	}

	if err := h.organisationService.CreateOrganisation(newOrganisation); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	newMember := &models.Members{
		UserID:     req.CreatedBy,
		OrgID:      newOrganisation.ID,
		MemberType: req.MemberType,
	}

	if err := h.organisationService.AddMemberToOrganisation(newMember); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(newOrganisation)
}

func (h *OrganisationHandler) GetOrganisationHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	id, err := strconv.Atoi(vars["id"])

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	if id <= 0 {
		http.Error(w, "OrgID is required", http.StatusBadRequest)
		return
	}

	organisation, err := h.organisationService.GetOrganisationByOrgID(id)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	if organisation == nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode("NULL")
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(organisation)
}

func (h *OrganisationHandler) UpdateOrganisationHandler(w http.ResponseWriter, r *http.Request) {
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
		Name string
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload: "+err.Error(), http.StatusBadRequest)
		return
	}

	if req.Name == "" {
		http.Error(w, "Name and CreatedyBy is required for creating organisation", http.StatusBadRequest)
		return
	}

	updateOrganisation := &models.Organisations{
		Name: req.Name,
		ID:   id,
	}

	if err := h.organisationService.UpdateOrganisation(updateOrganisation); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(updateOrganisation)
}
