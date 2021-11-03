import debug from 'debug';
import { injectable } from 'tsyringe';
import { EmployeeAccountCreationDTO, EmployeeAccountUpdateDTO } from '../dto/Accounts/AccountDTOs';
import { CRUD } from './CRUDInterface';
const log: debug.IDebugger = debug('app:ClientAccountRepository');
import { Account } from '../models/Account';
import { EmployeeAccount } from '../models/EmployeeAccount';
import { Pay } from '../models/Pay';
import { BaseError, Op } from 'sequelize';

@injectable()
export default class EmployeeAccountRepository implements CRUD {
  constructor() {
    log('Created new instance of EmployeeAccountRepository');
  }

  public create = async (accountInfo: EmployeeAccountCreationDTO): Promise<EmployeeAccount> => {
    try {
      const createdEmployeeAccount = EmployeeAccount.build(accountInfo, {
        include: [Account],
      });
      await createdEmployeeAccount.save();
      log(`added new client account ${createdEmployeeAccount.email}`);

      return Promise.resolve(createdEmployeeAccount);
    } catch (err: any) {
      log(err);
      if (err instanceof BaseError) {
        throw new Error(`${err.name}, message: ${err.message}`);
      }

      return Promise.reject(err);
    }
  };

  public get = async (email: string): Promise<EmployeeAccount | null> => {
    try {
      const employeeAccount = await EmployeeAccount.findByPk(email, {
        include: [Account, Pay],
      });

      log(`Employee Account with email ${employeeAccount?.email} has been retrieved`);
      return Promise.resolve(employeeAccount);
    } catch (err: any) {
      log(err);
      if (err instanceof BaseError) {
        throw new Error(`${err.name}, message: ${err.message}`);
      }

      return Promise.reject(err);
    }
  };

  // This function deletes the account completely (Account and ClientAccount)
  // Cannot delete supervisor due to foreign key constraint
  public delete = async (email: string): Promise<number> => {
    try {
      const deletedClientAccountStatus = await Account.destroy({
        where: { email: email },
      });

      log(`Client Account with email ${email} has been deleted`);
      return Promise.resolve(deletedClientAccountStatus);
    } catch (err: any) {
      if (err instanceof BaseError) {
        throw new Error(`${err.name}, message: ${err.message}`);
      }
      log(err);
      return Promise.reject(err);
    }
  };

  public update = async (email: string, updatedEmployeeAccountValue: EmployeeAccountUpdateDTO): Promise<number> => {
    try {
      if (updatedEmployeeAccountValue.account) {
        Account.update(updatedEmployeeAccountValue.account, {
          where: { email: email },
        });
      }

      delete updatedEmployeeAccountValue.account;
      await EmployeeAccount.update(updatedEmployeeAccountValue, {
        where: { email: email },
      });

      log(`Account with email ${email} has been updated`);
      return Promise.resolve(1);
    } catch (err: any) {
      if (err instanceof BaseError) {
        throw new Error(`${err.name}, message: ${err.message}`);
      }
      return Promise.reject(err);
    }
  };

  public getEmployeesByRegex = async (email: string): Promise<EmployeeAccount[]> => {
    try {
      const operatorsAliases = {
        like: Op.like,
      };
      const data = await EmployeeAccount.findAll({
        limit: 5,
        where: {
          email: {
            [operatorsAliases.like]: `${email}%`,
          },
        },
      });
      return Promise.resolve(data);
    } catch (err: any) {
      if (err instanceof BaseError) {
        return Promise.reject(new Error(`${err.name}, message: ${err.message}`));
      }
      return Promise.reject(err);
    }
  };

  public getAll = async (): Promise<EmployeeAccount[]> => {
    try {
      const clientAccounts = await EmployeeAccount.findAll({
        include: [Account, Pay],
      });

      log(`retrieved all employee accounts`);
      return Promise.resolve(clientAccounts);
    } catch (err: any) {
      if (err instanceof BaseError) {
        throw new Error(`${err.name}, message: ${err.message}`);
      }
      return Promise.reject(err);
    }
  };

  public getAllByBusiness = async (businessEmail: string): Promise<EmployeeAccount[]> => {
    try {
      const clientAccounts = await EmployeeAccount.findAll({
        where: {
          supervisorEmail: businessEmail,
        },
      });

      log(`retrieved all employee accounts`);
      return Promise.resolve(clientAccounts);
    } catch (err: any) {
      if (err instanceof BaseError) {
        Promise.reject(new Error(`${err.name}, message: ${err.message}`));
      }
      return Promise.reject(err);
    }
  };
}
