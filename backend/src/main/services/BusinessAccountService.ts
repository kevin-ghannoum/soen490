import debug from 'debug';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'tsyringe';
import { BusinessCreationRequestDTO } from '../dto/Accounts/AccountDTOs';
import HttpException from '../exceptions/HttpException';
import { BusinessAccount } from '../models/BusinessAccount';
import AddressRepository from '../repositories/AddressRepository';
import BusinessAccountRepository from '../repositories/BusinessAccountRepository';
import { AccountService } from './AccountService';
import { BusinessService } from './BusinessService';
const log: debug.IDebugger = debug('app:BusinessAccountService');

@injectable()
export class BusinessAccountService {
  constructor(
    private businessAccountRepository: BusinessAccountRepository,
    private addressRepository: AddressRepository,
    private businessService: BusinessService
  ) {
    log('Created instance of BusinessAccountService');
  }

  public createBusinessAccount = async (
    businessCreationRequestDTO: BusinessCreationRequestDTO
  ): Promise<BusinessAccount> => {
    if (
      AccountService.isThereNullValueAccountDTO({
        account: businessCreationRequestDTO.account,
        address: businessCreationRequestDTO.address,
      }) ||
      BusinessService.isThereNullValueBusinessCreationDTO(businessCreationRequestDTO.businessInfo)
    ) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
    }

    const address = await this.addressRepository.create(businessCreationRequestDTO.address);
    businessCreationRequestDTO.account.addressId = address[0].id;
    const businessAccount = await this.businessAccountRepository.create({
      account: businessCreationRequestDTO.account,
    });

    await this.businessService.createBusiness(businessCreationRequestDTO.businessInfo);
    return Promise.resolve(businessAccount);
  };

  public getBusinessAccountByEmail = async (email: string): Promise<BusinessAccount | null> => {
    return this.businessAccountRepository.get(email);
  };

  public deleteEmployeeAccountByEmail = async (email: string): Promise<number> => {
    return this.businessAccountRepository.delete(email);
  };
}
