// internal/api/routes.go
package api

import (
	"database/sql"

	"github.com/gorilla/mux"
	"github.com/theparthshira/plivo-assignment/internal/handlers"
	"github.com/theparthshira/plivo-assignment/internal/service"
)

func RegisterClientAPIRoutes(router *mux.Router, db *sql.DB) {
	openRouter := router.PathPrefix("/v1/client").Subrouter()

	incidentService := service.NewMySQLIncidentService(db)
	incidentHandler := handlers.NewIncidentHandler(incidentService)

	openRouter.HandleFunc("/add-new-incident", incidentHandler.AddServiceIncidentHandler).Methods("POST")
	openRouter.HandleFunc("/add-incident-comment", incidentHandler.AddIncidentCommentHandler).Methods("POST")
	openRouter.HandleFunc("/get-incident/{id}", incidentHandler.GetIncidentsFromServiceIDHandler).Methods("GET")
	openRouter.HandleFunc("/get-incident-detail/{id}", incidentHandler.GetIncidentDetailHandler).Methods("GET")
	openRouter.HandleFunc("/get-incident-comments/{id}", incidentHandler.GetIncidentCommentsHandler).Methods("GET")
}
