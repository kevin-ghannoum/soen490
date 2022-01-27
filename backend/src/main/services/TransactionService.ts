import debug from 'debug';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'tsyringe';
import { InvoiceCreationDTO } from '../dto/InvoiceDTO';
import {
  ExpenseRequestDTO,
  ExpenseUpdateRequestDTO,
  ProductionRequestDTO,
  ProductionUpdateRequestDTO,
  TransactionCreationDTO,
  TransactionUpdateDTO,
} from '../dto/Transaction/TransactionDTO';
import HttpException from '../exceptions/HttpException';
import { Transaction } from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionRepository';
import { ExpenseService } from './ExpenseService';
import { InvoiceService } from './InvoiceService';
import { ProductionService } from './ProductionService';

const log: debug.IDebugger = debug('app:TransactionService');

@injectable()
export class TransactionService {
  constructor(
    private transactionRepository: TransactionRepository,
    private expenseService: ExpenseService,
    private productionService: ProductionService,
    private invoiceService: InvoiceService
  ) {
    log('Created instance of TransactionService');
  }

  public getAllTransactionsForProjects = async (projectId: number): Promise<Transaction[] | null> => {
    return this.transactionRepository.getAllTransactionForProject(projectId);
  };

  public createTransactionExpense = async (expenseRequestDTO: ExpenseRequestDTO): Promise<Transaction> => {
    if (TransactionService.isThereNullValueTransactionCreationDTO(expenseRequestDTO.transaction)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
    }

    const transaction: Transaction = await this.transactionRepository.create(expenseRequestDTO.transaction);

    expenseRequestDTO.expense.id = transaction.id;
    await this.expenseService.createExpense(expenseRequestDTO.expense);

    return Promise.resolve(transaction);
  };

  public createTransactionProduction = async (productionRequestDTO: ProductionRequestDTO): Promise<Transaction> => {
    if (TransactionService.isThereNullValueTransactionCreationDTO(productionRequestDTO.transaction)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
    }

    const transaction: Transaction = await this.transactionRepository.create(productionRequestDTO.transaction);
    productionRequestDTO.production.id = transaction.id;
    const production = await this.productionService.createProduction(productionRequestDTO.production);

    const invoice: InvoiceCreationDTO = {
      totalAmount: transaction.amount,
      date: transaction.date,
      description: transaction.description,
      productionId: production.id,
      quantity: productionRequestDTO.quantity,
    };

    await this.invoiceService.createInvoice(invoice);
    return Promise.resolve(transaction);
  };

  public updateTransactionExpense = async (expenseUpdateRequestDTO: ExpenseUpdateRequestDTO): Promise<number> => {
    if (TransactionService.isThereNullValueTransactionUpdateDTO(expenseUpdateRequestDTO.transaction)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
    }

    const updatedTransactionExpense = await this.transactionRepository.update(
      expenseUpdateRequestDTO.id,
      expenseUpdateRequestDTO.transaction
    );
    await this.expenseService.updateExpense(expenseUpdateRequestDTO.id, expenseUpdateRequestDTO.expense);
    return Promise.resolve(updatedTransactionExpense);
  };

  public updateTransactionProduction = async (
    productionUpdateRequestDTO: ProductionUpdateRequestDTO
  ): Promise<number> => {
    if (TransactionService.isThereNullValueTransactionUpdateDTO(productionUpdateRequestDTO.transaction)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
    }

    const updatedTransactionProduction = await this.transactionRepository.update(
      productionUpdateRequestDTO.id,
      productionUpdateRequestDTO.transaction
    );

    await this.invoiceService.updateInvoice(productionUpdateRequestDTO.id, productionUpdateRequestDTO.invoice);
    return Promise.resolve(updatedTransactionProduction);
  };

  public deleteTransaction = async (transactionId: number): Promise<number> => {
    return this.transactionRepository.delete(transactionId);
  };

  public static isThereNullValueTransactionCreationDTO = (transactionCreationDTO: TransactionCreationDTO): boolean => {
    if (
      transactionCreationDTO === undefined ||
      !transactionCreationDTO.date ||
      !transactionCreationDTO.amount ||
      !transactionCreationDTO.description ||
      !transactionCreationDTO.projectId
    ) {
      return true;
    }
    return false;
  };

  public static isThereNullValueTransactionUpdateDTO = (transactionUpdateDTO: TransactionUpdateDTO): boolean => {
    if (
      transactionUpdateDTO === undefined ||
      !transactionUpdateDTO.date ||
      !transactionUpdateDTO.amount ||
      !transactionUpdateDTO.description
    ) {
      return true;
    }
    return false;
  };
}
