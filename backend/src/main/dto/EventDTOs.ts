import { InvitedDTO } from './InvitedDTOs';

export interface EventCreationDTO {
  title: string;
  start: Date;
  end: Date;
  location?: string;
  description?: string;
  invitee: string[];
  createdBy: string;
}

export interface EventUpdateDTO {
  title: string;
  start: Date;
  end: Date;
  location?: string;
  description?: string;
  invitee: InvitedDTO[];
  createdBy: string;
}
