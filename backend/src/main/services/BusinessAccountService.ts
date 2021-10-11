import debug from 'debug';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'tsyringe';
import { AccountRequestDTO } from '../dto/Accounts/AccountDTOs';
import HttpException from '../exceptions/HttpException';
import { BusinessAccount } from '../models/BusinessAccount';
import AddressRepository from '../repositories/AddressRepository';
import BusinessAccountRepository from '../repositories/BusinessAccountRepository';
import { AccountService } from './AccountService';
const log: debug.IDebugger = debug('app:BusinessAccountService');

@injectable()
export class BusinessAccountService {
  constructor(
    private businessAccountRepository: BusinessAccountRepository,
    private addressRepository: AddressRepository
  ) {
    log('Created instance of BusinessAccountService');
  }

  public createBusinessAccount = async (accountRequestDTO: AccountRequestDTO): Promise<BusinessAccount> => {
    if (AccountService.isThereNullValueAccountDTO(accountRequestDTO)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
    }

    const address = await this.addressRepository.create(accountRequestDTO.address);
    accountRequestDTO.account.addressId = address[0].id;
    return this.businessAccountRepository.create({ account: accountRequestDTO.account });
  };

  public getBusinessAccountByEmail = async (email: string): Promise<BusinessAccount | null> => {
    return this.businessAccountRepository.get(email);
  };

  public deleteEmployeeAccountByEmail = async (email: string): Promise<number> => {
    return this.businessAccountRepository.delete(email);
  };
}
