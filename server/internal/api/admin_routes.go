// internal/api/routes.go
package api

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/theparthshira/plivo-assignment/internal/handlers"
	"github.com/theparthshira/plivo-assignment/internal/service"
	"github.com/theparthshira/plivo-assignment/internal/socket"
)

func RegisterAdminAPIRoutes(router *mux.Router, db *sql.DB, wsManager *socket.Manager) {
	authenticatedRouter := router.PathPrefix("/v1/admin").Subrouter()
	// authenticatedRouter.Use(clerkhttp.RequireHeaderAuthorization())

	userService := service.NewMySQLUserService(db)
	userHandler := handlers.NewUserHandler(userService)

	organisationService := service.NewMySQLOrganisationService(db)
	organisationHandler := handlers.NewOrganisationHandler(organisationService)

	serviceService := service.NewMySQLServiceService(db, wsManager)
	serviceHandler := handlers.NewServiceHandler(serviceService)

	memberService := service.NewMySQLMemberService(db)
	memberHandler := handlers.NewMemberHandler(memberService)

	incidentService := service.NewMySQLIncidentService(db)
	incidentHandler := handlers.NewIncidentHandler(incidentService)

	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Welcome to the home page!")
	})

	router.HandleFunc("/ws/{orgID}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		orgID := vars["orgID"]
		if orgID == "" {
			http.Error(w, "Organization ID missing", http.StatusBadRequest)
			return
		}
		wsManager.ServeWs(w, r, orgID)
	})

	authenticatedRouter.HandleFunc("/signin", userHandler.SignInHandler).Methods("POST")
	authenticatedRouter.HandleFunc("/get-user-organisation/{id}", userHandler.GetUserOrganisationsHandler).Methods("GET")
	authenticatedRouter.HandleFunc("/get-user-role/{id}", userHandler.GetUserRoleHandler).Methods("POST")

	authenticatedRouter.HandleFunc("/create-organisation", organisationHandler.CreateOrganisationHandler).Methods("POST")
	authenticatedRouter.HandleFunc("/get-organisation/{id}", organisationHandler.GetOrganisationHandler).Methods("GET")
	authenticatedRouter.HandleFunc("/update-organisatiion/{id}", organisationHandler.UpdateOrganisationHandler).Methods("PUT")

	authenticatedRouter.HandleFunc("/get-organisation-services/{id}", serviceHandler.GetServicesByOrgIDHandler).Methods("GET")
	authenticatedRouter.HandleFunc("/create-service", serviceHandler.CreateServiceHandler).Methods("POST")
	authenticatedRouter.HandleFunc("/get-service/{id}", serviceHandler.GetServiceHandler).Methods("GET")
	authenticatedRouter.HandleFunc("/update-service/{id}", serviceHandler.UpdateServiceHandler).Methods("PUT")
	authenticatedRouter.HandleFunc("/delete-service/{id}", serviceHandler.DeleteServiceHandler).Methods("DELETE")
	authenticatedRouter.HandleFunc("/get-maintenance/{id}", serviceHandler.GetServiceMaintenanceHandler).Methods("GET")
	authenticatedRouter.HandleFunc("/add-maintenance", serviceHandler.AddServiceMaintenanceHandler).Methods("POST")
	authenticatedRouter.HandleFunc("/delete-maintenance/{id}", serviceHandler.DeleteServiceMaintenanceHandler).Methods("DELETE")

	authenticatedRouter.HandleFunc("/add-organisation-member", memberHandler.AddOrganisationMemberHandler).Methods("POST")
	authenticatedRouter.HandleFunc("/get-organisation-members/{id}", memberHandler.GetOrganisationMembersHandler).Methods("GET")
	authenticatedRouter.HandleFunc("/remove-organisation-member/{id}", memberHandler.RemoveOrganisationMemberHandler).Methods("DELETE")

	authenticatedRouter.HandleFunc("/get-all-incidents/{id}", incidentHandler.GetAllIncidentsFromOrgIDHandler).Methods("GET")
	authenticatedRouter.HandleFunc("/update-incident/{id}", incidentHandler.UpdateIncidentHandler).Methods("PUT")
}
