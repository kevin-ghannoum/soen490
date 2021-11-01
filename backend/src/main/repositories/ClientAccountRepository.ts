import debug from 'debug';
import { injectable } from 'tsyringe';
import { ClientAccountCreationDTO, ClientAccountUpdateDTO } from '../dto/Accounts/AccountDTOs';
import { CRUD } from './CRUDInterface';
const log: debug.IDebugger = debug('app:ClientAccountRepository');
import { Account } from '../models/Account';
import { ClientAccount } from '../models/ClientAccount';
import { Project } from '../models/Project';
import { SocialMediaPage } from '../models/SocialMediaPage';
import { BaseError, Op } from 'sequelize';

@injectable()
export default class ClientAccountRepository implements CRUD {
  constructor() {
    log('Created new instance of ClientAccountRepository');
  }

  public create = async (accountInfo: ClientAccountCreationDTO): Promise<ClientAccount> => {
    try {
      const createdClientAccount = ClientAccount.build(accountInfo, {
        include: [Account],
      });
      await createdClientAccount.save();

      log(`added new client account ${createdClientAccount.email}`);

      return Promise.resolve(createdClientAccount);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public get = async (email: string): Promise<ClientAccount | null> => {
    try {
      const clientAccount = await ClientAccount.findByPk(email, {
        include: [Account, Project, SocialMediaPage],
      });

      if (clientAccount) {
        log(`Account with email ${clientAccount?.email} has been retrieved`);
      } else {
        log(`No client account found with email ${email}`);
      }

      return Promise.resolve(clientAccount);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  // This function deletes the account completely (Account and ClientAccount)
  public delete = async (email: string): Promise<number> => {
    try {
      const deletedClientAccountStatus = await Account.destroy({
        where: { email: email },
      });

      log(`Client Account with email ${email} has been deleted`);
      return Promise.resolve(deletedClientAccountStatus);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public update = async (email: string, updatedClientAccountValue: ClientAccountUpdateDTO): Promise<number> => {
    try {
      if (updatedClientAccountValue.account) {
        Account.update(updatedClientAccountValue.account, {
          where: { email: email },
        });
      }

      delete updatedClientAccountValue.account;
      await ClientAccount.update(updatedClientAccountValue, {
        where: { email: email },
      });

      log(`Account with email ${email} has been updated`);
      return Promise.resolve(1);
    } catch (err: any) {
      return Promise.reject(err);
    }
  };

  public getClientsByRegex = async (email: string): Promise<ClientAccount[]> => {
    try {
      const operatorsAliases = {
        like: Op.like,
      };
      const data = await ClientAccount.findAll({
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

  public getAll = async (): Promise<ClientAccount[]> => {
    try {
      const clientAccounts = await ClientAccount.findAll({
        include: [Account, Project, SocialMediaPage],
      });

      log(`retrieved all client accounts`);
      return Promise.resolve(clientAccounts);
    } catch (err: any) {
      return Promise.reject(err);
    }
  };
}
