package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/theparthshira/plivo-assignment/internal/models"
	"github.com/theparthshira/plivo-assignment/internal/service"
)

type IncidentHandler struct {
	incidentService service.IncidentService
}

func NewIncidentHandler(incidentService service.IncidentService) *IncidentHandler {
	return &IncidentHandler{incidentService: incidentService}
}

func (h *IncidentHandler) AddServiceIncidentHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ServiceType string
		Description string
		ServiceID   int
		OrgID       int
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload: "+err.Error(), http.StatusBadRequest)
		return
	}

	if req.ServiceType == "" || req.Description == "" || req.ServiceID <= 0 || req.OrgID <= 0 {
		http.Error(w, "ServiceType, Description, ServiceID and OrgID is required for creating organisation", http.StatusBadRequest)
		return
	}

	newIncident := &models.Incidents{
		ServiceType: req.ServiceType,
		Description: req.Description,
		ServiceID:   req.ServiceID,
		OrgID:       req.OrgID,
	}

	if err := h.incidentService.AddNewIncident(newIncident); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(newIncident)
}

func (h *IncidentHandler) AddIncidentCommentHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		IncidentID int
		Comment    string
		CommentBy  string
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload: "+err.Error(), http.StatusBadRequest)
		return
	}

	if req.Comment == "" || req.CommentBy == "" || req.IncidentID <= 0 {
		http.Error(w, "ServiceType, Description, ServiceID and OrgID is required for creating organisation", http.StatusBadRequest)
		return
	}

	newComment := &models.IncidentComment{
		IncidentID: req.IncidentID,
		Comment:    req.Comment,
		CommentBy:  req.CommentBy,
	}

	if err := h.incidentService.AddIncidentComment(newComment); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(newComment)
}

func (h *IncidentHandler) GetIncidentsFromServiceIDHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	if id <= 0 {
		http.Error(w, "ServiceID is required", http.StatusBadRequest)
		return
	}

	incidents, err := h.incidentService.GetIncidentsFromServiceID(id)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK) // Return 200 OK whether getting or creating
	json.NewEncoder(w).Encode(incidents)
}

func (h *IncidentHandler) GetIncidentCommentsHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	if id <= 0 {
		http.Error(w, "IncidentID is required", http.StatusBadRequest)
		return
	}

	comments, err := h.incidentService.GetIncidentCommentsFromIncidentID(id)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK) // Return 200 OK whether getting or creating
	json.NewEncoder(w).Encode(comments)
}

func (h *IncidentHandler) GetAllIncidentsFromOrgIDHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	if id <= 0 {
		http.Error(w, "OrgID is required", http.StatusBadRequest)
		return
	}

	incidents, err := h.incidentService.GetIncidentsFromOrgID(id)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK) // Return 200 OK whether getting or creating
	json.NewEncoder(w).Encode(incidents)
}

func (h *IncidentHandler) UpdateIncidentHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	id, err := strconv.Atoi(vars["id"])

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	if id <= 0 {
		http.Error(w, "IncidentID is required", http.StatusBadRequest)
		return
	}

	var req struct {
		IncidentStatus string
		Description    string
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload: "+err.Error(), http.StatusBadRequest)
		return
	}

	if req.IncidentStatus == "" || req.Description == "" {
		http.Error(w, "IncidentStatus and Description is required for creating organisation", http.StatusBadRequest)
		return
	}

	updateIncident := &models.Incidents{
		ID:             id,
		IncidentStatus: req.IncidentStatus,
		Description:    req.Description,
	}

	if err := h.incidentService.UpdateIncident(updateIncident); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(updateIncident)
	return
}

func (h *IncidentHandler) GetIncidentDetailHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	id, err := strconv.Atoi(vars["id"])

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	if id <= 0 {
		http.Error(w, "IncidentID is required", http.StatusBadRequest)
		return
	}

	incident, err := h.incidentService.GetIncidentDetail(id)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(incident)
	return
}
