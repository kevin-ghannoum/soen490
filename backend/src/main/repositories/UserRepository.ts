// Temporary example of DAO implementation. We gonna implement an actual database later.
// Repository class are for database manipulation only. Leave data logic for service layer.

import { UserDTO } from '../dto/UserDTO';
import debug from 'debug';
import { injectable } from 'tsyringe';
import { CRUD } from './CRUDInterface';
const log: debug.IDebugger = debug('app:userReposity-example');

@injectable()
// Repository class implements CRUD interface to force it to have at least the 4 basic crud operations
export default class UserRepository implements CRUD {
  private users: Array<UserDTO> = [];

  constructor() {
    log('Created new instance of UserDao');
  }

  public create = async (user: UserDTO): Promise<UserDTO> => {
    this.users.push(user);

    log('added new user');
    // Good practice to return the entity being manipulated. In normal case it would be the entity from the database.
    return Promise.resolve(user);
  };

  public delete = async (userId: string): Promise<string> => {
    log(`User ${userId} has been deleted`);
    // implement delete functionality
    return Promise.resolve('A deleted entity');
  };

  public update = async (userId: string): Promise<string> => {
    log(`User ${userId} has been updated`);
    // implement update functionality
    return Promise.resolve('An updated entity');
  };

  public get = async (userId: string): Promise<string> => {
    log(`User ${userId} has been retrieve`);
    // implement get functionality
    return Promise.resolve('returning an entity');
  };

  public getAll = async (): Promise<UserDTO[]> => {
    log(`retrieved all users`);
    return Promise.resolve(this.users);
  };
}
