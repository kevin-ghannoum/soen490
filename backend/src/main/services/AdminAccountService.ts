import debug from 'debug';
import { injectable } from 'tsyringe';
import { AdminAccount } from '../models/AdminAccount';
import AdminAccountRepository from '../repositories/AdminAccountRepository';
const log: debug.IDebugger = debug('app:ClientAccountService');

@injectable()
export class AdminAccountService {
  constructor(private adminAccountRepository: AdminAccountRepository) {
    log('Created instance of ClientAccountService');
  }

  public getClientAccountByEmail = async (email: string): Promise<AdminAccount | null> => {
    return this.adminAccountRepository.get(email);
  };

  public deleteClientAccountByEmail = async (email: string): Promise<number> => {
    return this.adminAccountRepository.delete(email);
  };

  public getAllClientAccount = async (): Promise<AdminAccount[] | null> => {
    return this.adminAccountRepository.getAll();
  };

  public getRedux = async (email: string): Promise<AdminAccount | null> => {
    return this.adminAccountRepository.getRedux(email);
  };
}
