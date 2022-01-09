import { SaleCreationDTO } from './SaleDTO';

export interface ProjectCreationDTO {
  title: string;
  description: string;
  status: Status;
  serviceType: string;
  leadSource: string;
  leadCredit: string;
  leadRanking: string;
  createdDate: Date;
  deadlineDate: Date;
  followUpDate: Date;
  modifiedDate: Date;
  extraNotes: string;
  email: string;
  businessId: number;
  assignee: AssigneesFormat[];
}

export interface AssigneesFormat {
  email: string;
}
export interface ProjectUpdateDTO {
  title?: string;
  description?: string;
  status?: Status;
  serviceType?: string;
  leadSource?: string;
  leadCredit?: string;
  leadRanking?: string;
  createdDate?: Date;
  deadlineDate?: Date;
  followUpDate?: Date;
  modifiedDate?: Date;
  extraNotes?: string;
  email: string;
  id: number;
  assignee: AssigneesFormat[];
}

export interface ProjectRequestDTO {
  project: ProjectCreationDTO;
  sale: SaleCreationDTO;
}

export interface ProjectUpdateRequestDTO {
  project: ProjectUpdateDTO;
  sale: SaleCreationDTO;
}

export enum Status {
  BOOKED = 'BOOKED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  TO_BE_RESCHEDULED = 'TO BE RESCHEDULED',
  COMPLETED = 'COMPLETED',
}
