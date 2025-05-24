export enum LeadStatus {
  PENDING = "pending",
  REACHED_OUT = "reached_out",
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  linkedin: string;
  visas: string;
  message: string;
  dateCreated: string;
  status: LeadStatus;
}

export interface UpdateStatusRequest {
  id: string;
  status: LeadStatus;
}
