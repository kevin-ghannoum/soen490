import debug from 'debug';
import { injectable } from 'tsyringe';
import {
  AccountCreationDTO,
  AccountUpdateDTO,
} from '../dto/Accounts/AccountDTOs';
import { CRUD } from './CRUDInterface';
const log: debug.IDebugger = debug('app:AccountRepository');
import { Account } from '../models/Account';

@injectable()
export default class AccountRepository implements CRUD {
  constructor() {
    log('Created new instance of AccountRepository');
  }

  public create = async (accountInfo: AccountCreationDTO): Promise<Account> => {
    try {
      const createdAccount = Account.build(accountInfo);
      createdAccount.save();

      log(`Added new account ${createdAccount.email}`);
      return Promise.resolve(createdAccount);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public delete = async (email: string): Promise<number> => {
    try {
      const deletedAccountStatus = await Account.destroy({
        where: { email: email },
      });
      log(`Account with email ${email} has been deleted`);
      return Promise.resolve(deletedAccountStatus);
    } catch (err: any) {
      log(err);
      return Promise.resolve(err);
    }
  };

  public update = async (
    email: string,
    updatedValue: AccountUpdateDTO
  ): Promise<number> => {
    try {
      await Account.update(updatedValue, { where: { email: email } });
      log(`Account with email ${email} has been updated`);
      return Promise.resolve(1);
    } catch (err: any) {
      return Promise.reject(err);
    }
  };

  public get = async (email: string): Promise<Account | null> => {
    try {
      const account = await Account.findByPk(email);

      log(`Account with email ${account?.email} has been retrieved`);
      return Promise.resolve(account);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public getAll = async (): Promise<Account[]> => {
    try {
      const accounts = await Account.findAll();

      log(`Retrieved all users`);
      return Promise.resolve(accounts);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };
}
