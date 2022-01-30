import debug from 'debug';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'tsyringe';
import { ExpenseCreationDTO, ExpenseUpdateDTO } from '../dto/Transaction/TransactionDTO';
import HttpException from '../exceptions/HttpException';
import { Expense } from '../models/Expense';
import ExpenseRepository from '../repositories/ExpenseRepository';

const log: debug.IDebugger = debug('app:ExpenseService');

@injectable()
export class ExpenseService {
  constructor(private expenseRepository: ExpenseRepository) {
    log('Created instance of ExpenseService');
  }

  public getAllExpensesForProjects = async (projectId: number): Promise<Expense[] | null> => {
    return this.expenseRepository.getExpensesByProject(projectId);
  };

  public getExpense = async (id: number): Promise<Expense | null> => {
    return this.expenseRepository.get(id);
  };

  public createExpense = async (expenseCreationDTO: ExpenseCreationDTO): Promise<Expense> => {
    if (ExpenseService.isThereNullValueExpenseCreationDTO(expenseCreationDTO)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
    }

    return this.expenseRepository.create(expenseCreationDTO);
  };

  public updateExpense = async (id: number, expenseUpdateDTO: ExpenseUpdateDTO): Promise<number> => {
    return this.expenseRepository.update(id, expenseUpdateDTO);
  };

  public static isThereNullValueExpenseCreationDTO = (expenseCreationDTO: ExpenseCreationDTO): boolean => {
    if (expenseCreationDTO === undefined || !expenseCreationDTO.type) {
      return true;
    }
    return false;
  };
}
