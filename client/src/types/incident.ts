export interface IIncident {
  id: number;
  incident_status: string;
  service_type: string;
  description: string;
  service_id: number;
  org_id: number;
  created_at: string;
}

export interface IIncidentComment {
  id: number;
  incident_id: number;
  comment: string;
  comment_by: string;
  created_at: string;
}
