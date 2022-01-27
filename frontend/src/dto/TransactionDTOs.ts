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

export interface createTransactionDTO {
  amount: string | number;
  date: string;
  description: string;
  projectId: string;
}

export interface createExpenseDTO {
  transaction: createTransactionDTO;
  expense: ExpenseDTO;
}

export interface createProductionDTO {
  transaction: createTransactionDTO;
  production: ProductionDTO;
  quantity: string | number;
}

export interface ExpenseDTO {
  type: string;
}

export interface ProductionDTO {
  id: string;
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
