export interface IService {
  id: number;
  name: string;
  service_status: string;
  service_type: string;
  org_id: string;
  created_by: string;
}

export interface ILog {
  id: number;
  service_id: number;
  service_status: string;
  created_at: string;
}

export interface IMaintenance {
  id: number;
  service_id: number;
  maintenance_time: string;
}
