export interface IUser {
  id: number;
  name: string;
  email: string;
}

export interface IMember {
  id: number;
  user_id: number;
  org_id: number;
  member_type: string;
  created_at: string;
}
