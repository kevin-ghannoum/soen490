import debug from 'debug';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'tsyringe';
import { BusinessCreationRequestDTO } from '../dto/Accounts/AccountDTOs';
import { AccountRequestDTO } from '../dto/Accounts/AccountDTOs';
import HttpException from '../exceptions/HttpException';
import { BusinessAccount } from '../models/BusinessAccount';
import AddressRepository from '../repositories/AddressRepository';
import BusinessAccountRepository from '../repositories/BusinessAccountRepository';
import { AccountService } from './AccountService';
import { BusinessService } from './BusinessService';
import { SocialMediaPageService } from './SocialMediaPageService';
const log: debug.IDebugger = debug('app:BusinessAccountService');

@injectable()
export class BusinessAccountService {
  constructor(
    private businessAccountRepository: BusinessAccountRepository,
    private addressRepository: AddressRepository,
    private businessService: BusinessService,
    private socialMediaPageService: SocialMediaPageService
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
      BusinessService.isThereNullValueBusinessCreationDTO(businessCreationRequestDTO.businessInfo) ||
      SocialMediaPageService.isThereNullValueSocialMediaPageCreationDTO(businessCreationRequestDTO.socialMediaInfo)
    ) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
    }

    const address = await this.addressRepository.create(businessCreationRequestDTO.address);
    businessCreationRequestDTO.account.addressId = address[0].id;
    const businessAccount = await this.businessAccountRepository.create({
      account: businessCreationRequestDTO.account,
    });

    const business = await this.businessService.createBusiness(businessCreationRequestDTO.businessInfo);
    businessCreationRequestDTO.socialMediaInfo.email = businessAccount.account.email;
    businessCreationRequestDTO.socialMediaInfo.businessId = business.id;
    await this.socialMediaPageService.createSocialMediaPage(businessCreationRequestDTO.socialMediaInfo);

    return Promise.resolve(businessAccount);
  };

  public getBusinessAccountByEmail = async (email: string): Promise<BusinessAccount | null> => {
    return this.businessAccountRepository.get(email);
  };

  public deleteEmployeeAccountByEmail = async (email: string): Promise<number> => {
    return this.businessAccountRepository.delete(email);
  };
}
