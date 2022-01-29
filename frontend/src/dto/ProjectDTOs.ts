import { SaleCreationDTO } from './SaleDTO';

export interface ProjectCreationDTO {
  title: string;
  description: string;
  status: string;
  serviceType: string;
  leadSource: string;
  leadCredit: string;
  leadRanking: string;
  deadlineDate: string | undefined;
  followUpDate: string | undefined;
  extraNotes: string;
  email: string;
  businessId: number;
  assignee: Object[] | undefined;
}

export interface ProjectUpdateDTO {
  title: string;
  description: string;
  status: string;
  serviceType: string;
  leadSource: string;
  leadCredit: string;
  leadRanking: string;
  deadlineDate: string | undefined;
  followUpDate: string | undefined;
  modifiedDate: undefined;
  extraNotes: string;
  email: string;
  id: number;
  assignee: Object[] | undefined;
}

export interface ProjectRequestDTO {
  project: ProjectCreationDTO;
  sale: SaleCreationDTO;
}

export interface ProjectUpdateRequestDTO {
  project: ProjectUpdateDTO;
  sale: SaleCreationDTO;
}

export interface ProjectDisplay {
  id: number;
  businessId: string;
  createdDate: string;
  deadlineDate: string;
  description: string;
  email: string;
  extraNotes: string;
  followUpDate: string;
  leadCredit: string;
  leadRanking: string;
  leadSource: string;
  sale: SaleCreationDTO;
  serviceType: string;
  status: string;
  title: string;
}
