// Temporary example of DAO implementation. We gonna implement an actual database later.
// Repository class are for database manipulation only. Leave data logic for service layer.

import debug from 'debug';
import { injectable } from 'tsyringe';
import { AccountDTO } from '../dto/AccountDTO';
import { CRUD } from './CRUDInterface';
const log: debug.IDebugger = debug('app:userReposity-example');
import { Account } from '../models/Account';

@injectable()
// Repository class implements CRUD interface to force it to have at least the 4 basic crud operations
export default class AccountRepository implements CRUD {

  constructor() {
    log('Created new instance of UserDao');
  }

  public create = async (user: AccountDTO): Promise<AccountDTO> => {

    log('added new user');
    // Good practice to return the entity being manipulated. In normal case it would be the entity from the database.
    return Promise.resolve(user);
  };

  public delete = async (email: string): Promise<string> => {
    log(`Account with email ${email} has been deleted`);
    // implement delete functionality
    return Promise.resolve('A deleted entity');
  };

  public update = async (email: string): Promise<string> => {
    log(`Account ${email} has been updated`);
    // implement update functionality
    return Promise.resolve('An updated entity');
  };

  public get = async (email: string): Promise<object> => {
    log(`Account ${email} has been retrieved`);
    // implement get functionality
    const account = Account.findOne({where: {
        email: email
    }}).then(res=>console.log(res?.username))
    
    return {}
  };

  public getAll = async (): Promise<AccountDTO[]> => {
    log(`retrieved all users`);
    return Promise.resolve([]);
  };
}
