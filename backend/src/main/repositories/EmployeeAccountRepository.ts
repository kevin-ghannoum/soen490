import debug from 'debug';
import { injectable } from 'tsyringe';
import { EmployeeAccountCreationDTO, EmployeeAccountUpdateDTO } from '../dto/Accounts/AccountDTOs';
import { CRUD } from './CRUDInterface';
const log: debug.IDebugger = debug('app:ClientAccountRepository');
import { Account } from '../models/Account';
import { EmployeeAccount } from '../models/EmployeeAccount';
import { Pay } from '../models/Pay';
import { BaseError, Op } from 'sequelize';
import { Business } from '../models/Business';
import { Project } from '../models/Project';

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
        include: [
          {
            model: Account,
          },
          {
            model: Pay,
          },
          {
            model: Business,
            attributes: {
              exclude: ['id'],
            },
          },
        ],
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

  public getEmployeeRegexUsername = async (username: string): Promise<EmployeeAccount[]> => {
    try {
      const operatorsAliases = {
        like: Op.like,
      };
      const data = await EmployeeAccount.findAll({
        limit: 5,
        include: [
          {
            model: Account,
            where: {
              username: {
                [operatorsAliases.like]: `${username}%`,
              },
            },
            attributes: ['username', 'email'],
          },
        ],
        attributes: ['email'],
      });
      return Promise.resolve(data);
    } catch (err: any) {
      if (err instanceof BaseError) {
        return Promise.reject(new Error(`${err.name}, message: ${err.message}`));
      }
      return Promise.reject(err);
    }
  };

  public getUsernameOfEmployeeforProject = async (projectId: number): Promise<EmployeeAccount[]> => {
    try {
      const data = await EmployeeAccount.findAll({
        include: [
          {
            model: Project,
            where: {
              id: projectId,
            },
            attributes: [],
          },
          {
            model: Account,
            attributes: ['username'],
          },
        ],
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
        include: [
          {
            model: Account,
            attributes: {
              exclude: ['password'],
            },
          },
          {
            model: Pay,
          },
        ],
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
        include: [
          {
            model: Account,
            attributes: {
              exclude: ['password'],
            },
          },
          {
            model: Pay,
          },
        ],
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

  // Retrieve the employee account information needed for redux store
  public getRedux = async (email: string): Promise<EmployeeAccount | null> => {
    try {
      const account = await EmployeeAccount.findByPk(email, {
        attributes: ['title'],
        include: [
          {
            model: Account,
            attributes: ['email', 'firstName', 'lastName'],
          },
        ],
      });

      if (account) {
        log(`Employee Account with email ${account?.email} has been retrieved`);
      } else {
        log('No employee account has been found');
      }

      return Promise.resolve(account);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };
}
