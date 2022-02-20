import 'reflect-metadata';
import { mock } from 'jest-mock-extended';
import { container } from 'tsyringe';
import { sequelizeMock } from '../helpers/SequelizeMock';
import { ExpenseCreationDTO, Type } from '../../main/dto/Transaction/TransactionDTO';
import ExpenseRepository from '../../main/repositories/ExpenseRepository';
import { Expense } from '../../main/models/Expense';
import { ExpenseService } from '../../main/services/ExpenseService';

describe('ExpenseService tests', () => {
  let expenseServiceMock: any = null;

  beforeAll(() => {
    sequelizeMock();
  });

  beforeEach(() => {
    expenseServiceMock = mock<ExpenseRepository>();
    container.registerInstance(ExpenseRepository, expenseServiceMock);
  });

  afterEach(() => {
    container.clearInstances();
  });

  const EXPENSE_REQUEST_INFO: ExpenseCreationDTO = {
    id: 1,
    type: Type.TOOLS,
  };

  it('should create an expense', async () => {
    expenseServiceMock.create.mockResolvedValue(Expense.build(EXPENSE_REQUEST_INFO));

    const expenseService = container.resolve(ExpenseService);
    const result = await expenseService.createExpense(EXPENSE_REQUEST_INFO);
    expect(result.id).toBe(EXPENSE_REQUEST_INFO.id);
    expect(result.type).toBe(EXPENSE_REQUEST_INFO.type);
  });

  it('Create expense should fail because of missing value in request data', async () => {
    const EXPENSE_MISSING = {
      id: 1,
    };
    const expenseService = container.resolve(ExpenseService);
    await expect(expenseService.createExpense(EXPENSE_MISSING as unknown as ExpenseCreationDTO)).rejects.toThrowError(
      'Request data is missing some values'
    );
  });
});
