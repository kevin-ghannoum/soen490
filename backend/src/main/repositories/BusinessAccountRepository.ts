import debug from 'debug';
import { injectable } from 'tsyringe';
import {
  BusinessAccountCreationDTO,
  BusinessAccountUpdateDTO,
} from '../dto/Accounts/AccountDTOs';
import { CRUD } from './CRUDInterface';
const log: debug.IDebugger = debug('app:BusinessAccountRepository');
import { AdminAccount } from '../models/AdminAccount';
import { Account } from '../models/Account';
import { BusinessAccount } from '../models/BusinessAccount';

@injectable()
export default class BusinessAccountRepository implements CRUD {
  constructor() {
    log('Created new instance of BusinessAccountRepository');
  }

  public create = async (
    accountInfo: BusinessAccountCreationDTO
  ): Promise<BusinessAccount> => {
    try {
      const createdAccount = BusinessAccount.build(accountInfo, {
        include: [Account],
      });
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
      log(`Admin Account with email ${email} has been deleted`);
      return Promise.resolve(deletedAccountStatus);
    } catch (err: any) {
      log(err);
      return Promise.resolve(err);
    }
  };

  public update = async (
    email: string,
    updatedValue: BusinessAccountUpdateDTO
  ): Promise<number> => {
    try {
      if (updatedValue.account) {
        Account.update(updatedValue.account, {
          where: { email: email },
        });
      }

      log(`Business Account with email ${email} has been updated`);
      return Promise.resolve(1);
    } catch (err: any) {
      return Promise.reject(err);
    }
  };

  public get = async (email: string): Promise<AdminAccount | null> => {
    try {
      const account = await BusinessAccount.findByPk(email, {
        include: [Account],
      });

      if (account) {
        log(`Business Account with email ${account?.email} has been retrieved`);
      } else {
        log('No business account has been found');
      }

      return account;
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public getAll = async (): Promise<BusinessAccount[]> => {
    try {
      const businessAccountList = await BusinessAccount.findAll();
      log(`retrieved all business accounts`);
      return Promise.resolve(businessAccountList);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };
}
