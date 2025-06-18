package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	"github.com/theparthshira/plivo-assignment/internal/models"
	"github.com/theparthshira/plivo-assignment/internal/service"
)

type ServiceHandler struct {
	serviceService service.ServiceService
}

// NewUserHandler creates a new UserHandler.
func NewServiceHandler(serviceService service.ServiceService) *ServiceHandler {
	return &ServiceHandler{serviceService: serviceService}
}

func (h *ServiceHandler) GetServicesByOrgIDHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	if id <= 0 {
		http.Error(w, "OrgID is required", http.StatusBadRequest)
		return
	}

	services, err := h.serviceService.GetAllServicesByOrgID(id)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK) // Return 200 OK whether getting or creating
	json.NewEncoder(w).Encode(services)
}

func (h *ServiceHandler) CreateServiceHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name        string
		ServiceType string
		OrgID       int
		CreatedBy   int
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload: "+err.Error(), http.StatusBadRequest)
		return
	}

	if req.Name == "" || req.ServiceType == "" || req.OrgID <= 0 || req.CreatedBy <= 0 {
		http.Error(w, "Name and CreatedyBy is required for creating organisation", http.StatusBadRequest)
		return
	}

	newService := &models.Services{
		Name:        req.Name,
		ServiceType: req.ServiceType,
		OrgID:       req.OrgID,
		CreatedBy:   req.CreatedBy,
	}

	if err := h.serviceService.CreateService(newService); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(newService)
}

func (h *ServiceHandler) UpdateServiceHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	id, err := strconv.Atoi(vars["id"])

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	if id <= 0 {
		http.Error(w, "ServiceID is required", http.StatusBadRequest)
		return
	}

	var req struct {
		Name          string
		ServiceType   string
		ServiceStatus string
		OrgID         int
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload: "+err.Error(), http.StatusBadRequest)
		return
	}

	if req.Name == "" || req.ServiceType == "" {
		http.Error(w, "Name and CreatedyBy is required for creating organisation", http.StatusBadRequest)
		return
	}

	updateService := &models.Services{
		Name:          req.Name,
		ServiceType:   req.ServiceType,
		ServiceStatus: req.ServiceStatus,
		ID:            id,
		OrgID:         req.OrgID,
	}

	if err := h.serviceService.UpdateService(updateService); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(updateService)
	return
}

func (h *ServiceHandler) DeleteServiceHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	id, err := strconv.Atoi(vars["id"])

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	if id <= 0 {
		http.Error(w, "ServiceID is required", http.StatusBadRequest)
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
		http.Error(w, "OrgID is required for creating organisation", http.StatusBadRequest)
		return
	}

	if err := h.serviceService.DeleteService(id, req.OrgID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode("OK")
	return
}

func (h *ServiceHandler) AddServiceMaintenanceHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ServiceID       int
		MaintenanceTime time.Time
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload: "+err.Error(), http.StatusBadRequest)
		return
	}

	if req.ServiceID <= 0 {
		http.Error(w, "MaintenanceTime and ServiceID is required for creating organisation", http.StatusBadRequest)
		return
	}

	newMaintenance := &models.ServiceMaintenance{
		ServiceID:       req.ServiceID,
		MaintenanceTime: req.MaintenanceTime,
	}

	if err := h.serviceService.CreateServiceMaintenance(newMaintenance); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(newMaintenance)
}

func (h *ServiceHandler) GetServiceMaintenanceHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	if id <= 0 {
		http.Error(w, "ServiceID is required", http.StatusBadRequest)
		return
	}

	maintenances, err := h.serviceService.GetAllServiceMaintenanceByServiceID(id)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK) // Return 200 OK whether getting or creating
	json.NewEncoder(w).Encode(maintenances)
}

func (h *ServiceHandler) DeleteServiceMaintenanceHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	id, err := strconv.Atoi(vars["id"])

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	if id <= 0 {
		http.Error(w, "MaintenanceID is required", http.StatusBadRequest)
		return
	}

	if err := h.serviceService.DeleteServiceMaintenance(id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode("OK")
	return
}

func (h *ServiceHandler) GetServiceHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	id, err := strconv.Atoi(vars["id"])

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	if id <= 0 {
		http.Error(w, "ServiceID is required", http.StatusBadRequest)
		return
	}

	service, err := h.serviceService.GetServiceByID(id)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	if service == nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode("NULL")
	}

	logs, err := h.serviceService.GetServiceLogByID(id)

	maintenances, err := h.serviceService.GetAllServiceMaintenanceByServiceID(id)

	response := struct {
		Service      models.Services
		Logs         []models.ServiceLog
		Maintenances []models.ServiceMaintenance
	}{
		Service:      *service,
		Logs:         logs,
		Maintenances: maintenances,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
