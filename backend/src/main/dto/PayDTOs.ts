export interface PayCreationDTO {
  issueDate: Date;
  hoursWorked: number;
  status?: PayStatus;
  period: string;
  email: string;
}

export interface PayUpdateDTO {
  issueDate?: Date;
  hoursWorked?: number;
  status?: PayStatus;
  period?: string;
  email?: string;
}

export enum PayStatus {
  PAID = 'PAID',
  NOT_PAID = 'NOT_PAID',
}
