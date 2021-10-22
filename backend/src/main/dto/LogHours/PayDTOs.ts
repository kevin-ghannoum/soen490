export interface PayCreationDTO {
  issueDate: Date;
  hoursWorked: number;
  status: PayStatus;
  periodStart: string;
  periodEnd: string;
  email: string;
  amount: number;
}

export interface PayUpdateDTO {
  issueDate?: Date;
  hoursWorked?: number;
  status?: PayStatus;
  periodStart?: string;
  periodEnd?: string;
  email?: string;
  amount: number;
}

export enum PayStatus {
  PAID = 'PAID',
  NOT_PAID = 'NOT_PAID',
}
