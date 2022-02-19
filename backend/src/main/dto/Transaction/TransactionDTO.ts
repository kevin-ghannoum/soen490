import { InvoiceUpdateDTO, PaymentType } from '../InvoiceDTO';

export interface TransactionCreationDTO {
  amount: number;
  date: Date;
  description: string;
  projectId: number;
}

export interface TransactionUpdateDTO {
  amount?: number;
  date?: Date;
  description?: string;
}

export interface ExpenseCreationDTO {
  id: number;
  type: Type;
}

export interface ExpenseUpdateDTO {
  type?: Type;
}

export interface ExpenseRequestDTO {
  transaction: TransactionCreationDTO;
  expense: ExpenseCreationDTO;
}

export interface ProductionRequestDTO {
  transaction: TransactionCreationDTO;
  production: ProductionCreationDTO;
<<<<<<< HEAD
  paymentType: PaymentType;
=======
  paymentType: paymentType;
>>>>>>> 5107550a9ee76f747ff2f46bc2f2766cca495a32
}

export interface ExpenseUpdateRequestDTO {
  id: number;
  transaction: TransactionUpdateDTO;
  expense: ExpenseUpdateDTO;
}

export interface ProductionUpdateRequestDTO {
  id: number;
  transaction: TransactionUpdateDTO;
  invoice: InvoiceUpdateDTO;
}

export interface ExpenseCreationDTO {
  id: number;
  type: Type;
}

export interface ExpenseUpdateDTO {
  id?: number;
  type?: Type;
}

export interface ProductionCreationDTO {
  id: number;
}

export interface ProductionUpdateDTO {
  transaction?: TransactionUpdateDTO;
<<<<<<< HEAD
  paymentType: PaymentType;
=======
  paymentType: paymentType;
>>>>>>> 5107550a9ee76f747ff2f46bc2f2766cca495a32
}

export enum Type {
  TOOLS = 'TOOLS',
  OTHER = 'OTHER',
  WAGES = 'WAGES',
}
