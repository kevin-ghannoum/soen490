import debug from 'debug';
import { injectable } from 'tsyringe';
import { AdminAccountCreationDTO, AdminAccountUpdateDTO } from '../dto/Accounts/AccountDTOs';
import { CRUD } from './CRUDInterface';
const log: debug.IDebugger = debug('app:AdminAccountRepository');
import { AdminAccount } from '../models/AdminAccount';
import { Account } from '../models/Account';

@injectable()
export default class AdminAccountRepository implements CRUD {
  constructor() {
    log('Created new instance of AdminAccountRepository');
  }

  public create = async (accountInfo: AdminAccountCreationDTO): Promise<AdminAccount> => {
    try {
      const createdAccount = AdminAccount.build(accountInfo, {
        include: [Account],
      });
      await createdAccount.save();

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

  public update = async (email: string, updatedValue: AdminAccountUpdateDTO): Promise<number> => {
    try {
      if (updatedValue.account) {
        Account.update(updatedValue.account, {
          where: { email: email },
        });
      }

      log(`Admin Account with email ${email} has been updated`);
      return Promise.resolve(1);
    } catch (err: any) {
      return Promise.reject(err);
    }
  };

  public get = async (email: string): Promise<AdminAccount | null> => {
    try {
      const account = await AdminAccount.findByPk(email, {
        include: [Account],
      });

      if (account) {
        log(`Admin Account with email ${account?.email} has been retrieved`);
      } else {
        log('No admin account has been found');
      }

      return account;
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public getAll = async (): Promise<AdminAccount[]> => {
    try {
      const accountsExample = await AdminAccount.findAll();

      log(`retrieved all admin accounts`);
      return Promise.resolve(accountsExample);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public getRedux = async (email: string): Promise<AdminAccount | null> => {
    try {
      const account = await AdminAccount.findByPk(email, {
        include: [
          {
            model: Account,
            attributes: ['email', 'firstName', 'lastName'],
          },
        ],
      });

      if (account) {
        log(`Admin Account with email ${account?.email} has been retrieved`);
      } else {
        log('No admin account has been found');
      }

      return Promise.resolve(account);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };
}
