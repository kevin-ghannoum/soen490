import debug from 'debug';
import { injectable } from 'tsyringe';
import { ClientAccount } from '../models/ClientAccount';
import ClientAccountRepository from '../repositories/ClientAccountRepository';
const log: debug.IDebugger = debug('app:EmployeeAccountService');

@injectable()
export class ClientAccountService {
  constructor(
    private clientAccountRepository: ClientAccountRepository
  ) {
    log('Created instance of ClientAccountService');
  }

  public getAllClientAccount = async (): Promise< ClientAccount []| null> => {
    return this.clientAccountRepository.getAll();
  };

  public getEmployeesByRegex = async (email: string): Promise< ClientAccount []| null> => {
    return this.clientAccountRepository.getClientsByRegex(email);
  }

}
