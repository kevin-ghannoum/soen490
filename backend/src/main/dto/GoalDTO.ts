export interface GoalCreationDTO {
  title: string;
  value: number;
  deadline: Date;
  type: Type;
  businessId: number;
}

export interface GoalUpdateDTO {
  id?: number;
  title?: string;
  value?: number;
  deadline?: Date;
  type?: Type;
  businessId: number;
}

export enum Type {
  SALES = 'SALES',
  EXPENSES = 'EXPENSES',
  REJECTED = 'REJECTED',
}
