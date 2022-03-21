import { InvoiceDTO, InvoiceUpdateDTO } from './InvoiceDTO';

export interface ExpenseDataRetrievalFormatDTO {
  id: string;
  type: string;
  transaction: TransactionDTO;
}

export interface ProductionDataRetrievalFormatDTO {
  id: string;
  transaction: TransactionDTO;
  invoice: InvoiceDTO;
}

export interface TransactionDTO {
  id: string;
  amount: string;
  date: string;
  description: string;
  projectId: string;
}

export interface CreateTransactionDTO {
  amount: string | number;
  date: string;
  description: string;
  projectId: string;
}

export interface CreateExpenseDTO {
  transaction: CreateTransactionDTO;
  expense: ExpenseDTO;
}

export interface CreateProductionDTO {
  transaction: CreateTransactionDTO;
  production: ProductionDTO;
  paymentType: string;
}

export interface ExpenseDTO {
  type: string;
}

export interface ProductionDTO {
  id: string;
}

export interface AllBusinessExpensesDTO {
  projectId: string;
  wagesValue: string;
  toolsValue: string;
  othersValue: string;
  name: string;
}

export interface AllBusinessProductionsDTO {
  projectId: string;
  value: string;
  name: string;
}

export interface TransactionUpdateDTO {
  amount: number | string;
  description: string;
  date: string;
}

export interface TransactionExpenseUpdateDTO {
  id: number;
  transaction: TransactionUpdateDTO;
  expense: ExpenseDTO;
}

export interface TransactionProductionUpdateDTO {
  id: number;
  transaction: TransactionUpdateDTO;
  invoice: InvoiceUpdateDTO;
}
