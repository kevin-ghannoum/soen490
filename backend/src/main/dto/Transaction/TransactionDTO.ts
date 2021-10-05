export interface TransactionCreationDTO {
  amount: number;
  date: Date;
  description: string;
  projectId: number;
}

export interface TransactionUpdateDTO {
  id?: number;
  amount?: number;
  date?: Date;
  description?: string;
  projectId?: number;
}

export interface ExpenseCreationDTO {
  transaction: TransactionCreationDTO;
  type: Type;
}

export interface ExpenseUpdateDTO {
  transaction?: TransactionUpdateDTO;
  type?: Type;
}

export interface ProductionCreationDTO {
  transaction: TransactionCreationDTO;
}

export interface ProductionUpdateDTO {
  transaction?: TransactionUpdateDTO;
}

export enum Type {
  TOOLS = 'TOOLS',
  OTHER = 'OTHER',
  WAGES = 'WAGES',
}
