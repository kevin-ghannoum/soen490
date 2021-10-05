import debug from 'debug';
import { injectable } from 'tsyringe';
import {
  TransactionCreationDTO,
  TransactionUpdateDTO,
} from '../dto/Transaction/TransactionDTO';
import { CRUD } from './CRUDInterface';
const log: debug.IDebugger = debug('app:TransactionDTO');
import { Transaction } from '../models/Transaction';

@injectable()
export default class TransactionRepository implements CRUD {
  constructor() {
    log('Created new instance of TransactionRepository');
  }

  public create = async (
    transactionInfo: TransactionCreationDTO
  ): Promise<Transaction> => {
    try {
      const createdTransaction = Transaction.build(transactionInfo);
      createdTransaction.save();

      log(`Added new transaction with id ${createdTransaction.id}`);
      return Promise.resolve(createdTransaction);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public delete = async (id: number): Promise<number> => {
    try {
      const deleteTransactionStatus = await Transaction.destroy({
        where: { id: id },
      });

      log(`Transaction ${id} has been deleted`);
      return Promise.resolve(deleteTransactionStatus);
    } catch (err: any) {
      log(err);
      return Promise.resolve(err);
    }
  };

  public update = async (
    id: number,
    updatedValue: TransactionUpdateDTO
  ): Promise<number> => {
    try {
      await Transaction.update(updatedValue, { where: { id: id } });

      log(`Transaction ${id} has been updated`);
      return Promise.resolve(1);
    } catch (err: any) {
      return Promise.reject(err);
    }
  };

  public get = async (id: number): Promise<Transaction | null> => {
    try {
      const transaction = await Transaction.findByPk(id);

      log(`Transaction ${transaction?.id} has been retrieved`);
      if (transaction) {
        log(transaction);
      } else {
        log('transaction not found');
      }
      return Promise.resolve(transaction);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public getAll = async (): Promise<Transaction[]> => {
    try {
      const transactions = await Transaction.findAll();
      
      if (transactions) {
        log(transactions);
      } else {
        log('transaction not found');
      }
      
      log(`Retrieved all transactions`);
      return Promise.resolve(transactions);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };
}
