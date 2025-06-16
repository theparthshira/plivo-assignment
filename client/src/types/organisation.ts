export interface IOrganisation {
  id: number;
  name: string;
  created_by: number;
}

export type OrganisationOptions = {
  label: string;
  value: string;
}[];

export type MembersList = {
  ID: number;
  MemberType: string;
  CreatedAt: string;
  Email: string;
};
