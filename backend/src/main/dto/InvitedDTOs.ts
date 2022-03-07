export interface InvitedDTO {
  status: Status;
  email: string;
  id: number;
}

export enum Status {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  PENDING = 'PENDING',
}
