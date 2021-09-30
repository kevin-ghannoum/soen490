// Temporary example of DAO implementation. We gonna implement an actual database later.
// Repository class are for database manipulation only. Leave data logic for service layer.

import debug from 'debug';
import { injectable } from 'tsyringe';
import { AccountCreationDTO } from '../dto/AccountCreationDTO';
import { CRUD } from './CRUDInterface';
const log: debug.IDebugger = debug('app:userReposity-example');
import { Account } from '../models/Account';
import { Event } from '../models/Event';

@injectable()
// Repository class implements CRUD interface to force it to have at least the 4 basic crud operations
export default class AccountRepository implements CRUD {

  constructor() {
    log('Created new instance of AccountDao');
  }

  public create = async (accountInfo: AccountCreationDTO): Promise<Account> => {

    log('added new user');
    // Good practice to return the entity being manipulated. In normal case it would be the entity from the database.

    const createdAccount = Account.build({ email: accountInfo?.email, firstName: "Bob", lastName: "Bobby", phoneNumber: "514-123-1234", username: "bob123", password: "ENCRYPTED PASSWORD" })
    createdAccount.save();

    return Promise.resolve(createdAccount);
  };

  public delete = async (email: string): Promise<string> => {
    log(`Account with email ${email} has been deleted`);
    
    Account.destroy(
      { where: { email: email } }
    )

    return Promise.resolve('A deleted entity');
  };

  public update = async (email: string): Promise<string> => {
    log(`Account with email ${email} has been updated`);

    Account.update(
      {
        firstName: 'Bobby The 1st'
      },
      { where: { email: email } }
    )

    return Promise.resolve('An updated entity');
  };

  public get = async (email: string): Promise<object> => {
    log(`Account with email ${email} has been retrieved`);

    //Typical GET query EXAMPLE
    const account = await Account.findOne({where: {
        email: email
    }})

    //ASSOCIATION QUERY EXAMPLE (JOIN)
    const test2 = await Account.findOne({ include: [Event] });

    return {account}
  };

  public getAll = async (): Promise<AccountCreationDTO[]> => {
    log(`retrieved all users`);

    //FINDALL EXAMPLE
    const accountsExample = await Account.findAll({where: {
      firstName: "test"
    }})

    return Promise.resolve(accountsExample);
  };
}
