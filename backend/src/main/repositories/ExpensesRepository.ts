import debug from 'debug';
import { injectable } from 'tsyringe';
import {
  ExpenseCreationDTO,
  ExpenseUpdateDTO,
} from '../dto/Transaction/TransactionDTO';
import { CRUD } from './CRUDInterface';
const log: debug.IDebugger = debug('app:ExpenseRepository');
import { Transaction } from '../models/Transaction';
import { Expense } from '../models/Expense';

@injectable()
export default class ExpenseRepository implements CRUD {
  constructor() {
    log('Created new instance of ExpenseRepository');
  }

  public create = async (
    transactionInfo: ExpenseCreationDTO
  ): Promise<Expense> => {
    try {
      const createdExpense = Expense.build(transactionInfo, {
        include: [Transaction],
      });
      createdExpense.save();

      log(`added new expense ${createdExpense.id}`);
      return Promise.resolve(createdExpense);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public get = async (id: number): Promise<Expense | null> => {
    try {
      const expense = await Expense.findByPk(id, {
        include: [Transaction],
      });

      if (expense) {
        log(expense);
        log(`Expense with id ${expense?.id} has been retrieved`);
      } else {
        log(`No expense have been found with id ${id}`);
      }

      return Promise.resolve(expense);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  // This function deletes the account completely (Account and ClientAccount)
  public delete = async (id: number): Promise<number> => {
    try {
      const deletedExpenseStatus = await Transaction.destroy({
        where: { id: id },
      });

      log(`Expense with id ${id} has been deleted`);

      return Promise.resolve(deletedExpenseStatus);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public update = async (
    id: number,
    updatedExpenseValue: ExpenseUpdateDTO
  ): Promise<number> => {
    try {
      if (updatedExpenseValue.transaction) {
        Transaction.update(updatedExpenseValue.transaction, {
          where: { id: id },
        });
      }
      delete updatedExpenseValue.transaction;
      await Expense.update(updatedExpenseValue, {
        where: { id: id },
      });

      log(`Expense with id ${id} has been updated`);
      
      return Promise.resolve(1);
    } catch (err: any) {
      return Promise.reject(err);
    }
  };

  public getAll = async (): Promise<Expense[]> => {
    try {
      const expenses = await Expense.findAll({
        include: [Transaction],
      });

      log(expenses);
      log(`retrieved all expenses`);

      return Promise.resolve(expenses);
    } catch (err: any) {
      return Promise.reject(err);
    }
  };
}
