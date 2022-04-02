import 'reflect-metadata';
import { mock } from 'jest-mock-extended';
import { container } from 'tsyringe';
import { sequelizeMock } from '../helpers/SequelizeMock';
import TransactionRepository from '../../main/repositories/TransactionRepository';
import { ExpenseRequestDTO, ProductionRequestDTO, Type, ExpenseUpdateRequestDTO, ProductionUpdateRequestDTO } from '../../main/dto/Transaction/TransactionDTO';
import { Transaction } from '../../main/models/Transaction';
import ExpenseRepository from '../../main/repositories/ExpenseRepository';
import { Expense } from '../../main/models/Expense';
import { TransactionService } from '../../main/services/TransactionService';
import ProductionRepository from '../../main/repositories/ProductionRepository';
import InvoiceRepository from '../../main/repositories/InvoiceRepository';
import { InvoiceCreationDTO, PaymentType } from '../../main/dto/InvoiceDTO';
import { Invoice } from '../../main/models/Invoice';

describe('TransactionService tests', () => {
  let transactionServiceMock: any = null;
  let expenseServiceMock: any = null;
  let productionServiceMock: any = null;
  let invoiceServiceMock: any = null;
  const date = new Date();

  beforeAll(() => {
    sequelizeMock();
  });

  beforeEach(() => {
    transactionServiceMock = mock<TransactionRepository>();
    expenseServiceMock = mock<ExpenseRepository>();
    productionServiceMock = mock<ProductionRepository>();
    invoiceServiceMock = mock<InvoiceRepository>();
    container.registerInstance(TransactionRepository, transactionServiceMock);
    container.registerInstance(ExpenseRepository, expenseServiceMock);
    container.registerInstance(ProductionRepository, productionServiceMock);
    container.registerInstance(InvoiceRepository, invoiceServiceMock);
  });

  afterEach(() => {
    container.clearInstances();
  });

  const PRODUCTION_REQUEST_INFO: ProductionRequestDTO = {
    transaction: {
      amount: 23,
      date: date,
      description: 'This is a production',
      projectId: 1,
    },
    production: {
      id: 1,
    },
    paymentType: PaymentType.DEPOSIT,
  };

  const INVOICE: InvoiceCreationDTO = {
    totalAmount: 23,
    date: date,
    description: 'description',
    productionId: 1,
    paymentType: PaymentType.DEPOSIT,
  };

  const EXPENSE_REQUEST_INFO: ExpenseRequestDTO = {
    transaction: {
      amount: 23,
      date: date,
      description: 'This is an expense',
      projectId: 1,
    },
    expense: {
      id: 1,
      type: Type.TOOLS,
    },
  };

  it('should create a transactionExpense', async () => {
    transactionServiceMock.create.mockResolvedValue(Transaction.build(EXPENSE_REQUEST_INFO.transaction));
    expenseServiceMock.create.mockResolvedValue(Expense.build(EXPENSE_REQUEST_INFO.expense));

    const transactionService = container.resolve(TransactionService);
    const result = await transactionService.createTransactionExpense(EXPENSE_REQUEST_INFO);
    expect(result.amount).toBe(EXPENSE_REQUEST_INFO.transaction.amount);
    expect(result.description).toBe(EXPENSE_REQUEST_INFO.transaction.description);
  });

  it('should create a transactionProduction', async () => {
    transactionServiceMock.create.mockResolvedValue(Transaction.build(PRODUCTION_REQUEST_INFO.transaction));
    productionServiceMock.create.mockResolvedValue(Expense.build(PRODUCTION_REQUEST_INFO.production));
    invoiceServiceMock.create.mockResolvedValue(Invoice.build(INVOICE));

    const transactionService = container.resolve(TransactionService);
    const result = await transactionService.createTransactionProduction(PRODUCTION_REQUEST_INFO);
    expect(result.amount).toBe(PRODUCTION_REQUEST_INFO.transaction.amount);
    expect(result.description).toBe(PRODUCTION_REQUEST_INFO.transaction.description);
    expect(result.id).toBe(PRODUCTION_REQUEST_INFO.production.id);
  });

  it('Create transactionExpense should fail because of missing value in request data', async () => {
    const EXPENSE = {
      transaction: {
        projectId: 1,
      },
      expense: {},
    };
    const transactionService = container.resolve(TransactionService);
    await expect(
      transactionService.createTransactionExpense(EXPENSE as unknown as ExpenseRequestDTO)
    ).rejects.toThrowError('Request data is missing some values');
  });

  it('Create productionExpense should fail because of missing value in request data', async () => {
    const PRODUCTION = {
      transaction: {
        projectId: 1,
      },
      production: {},
      paymentType: PaymentType.DEPOSIT,
    };
    const transactionService = container.resolve(TransactionService);
    await expect(
      transactionService.createTransactionProduction(PRODUCTION as unknown as ProductionRequestDTO)
    ).rejects.toThrowError('Request data is missing some values');
  });

  it('Update transactionExpense should fail because of missing value in request data', async () => {
    const EXPENSE = {
      transaction: {
        projectId: 1,
      },
      expense: {},
    };
    const transactionService = container.resolve(TransactionService);
    await expect(
      transactionService.updateTransactionExpense(EXPENSE as unknown as ExpenseUpdateRequestDTO)
    ).rejects.toThrowError('Request data is missing some values');
  });

  it('Update productionExpense should fail because of missing value in request data', async () => {
    const PRODUCTION = {
      transaction: {
        projectId: 1,
      },
      production: {},
      paymentType: PaymentType.DEPOSIT,
    };
    const transactionService = container.resolve(TransactionService);
    await expect(
      transactionService.updateTransactionProduction(PRODUCTION as unknown as ProductionUpdateRequestDTO)
    ).rejects.toThrowError('Request data is missing some values');
  });
});
