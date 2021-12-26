import { AppMetadata, AuthenticationClient, ManagementClient, SignUpUserData, User, UserMetadata } from 'auth0';
import debug from 'debug';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { BusinessCreationRequestDTO } from '../dto/Accounts/AccountDTOs';
import HttpException from '../exceptions/HttpException';
import { BusinessAccount } from '../models/BusinessAccount';
import AddressRepository from '../repositories/AddressRepository';
import BusinessAccountRepository from '../repositories/BusinessAccountRepository';
import { AccountService } from './AccountService';
import { BusinessService } from './BusinessService';
import { SocialMediaPageService } from './SocialMediaPageService';
import { Roles } from '../security/Roles';
import AccountRepository from '../repositories/AccountRepository';
import { getCurrentUserEmail } from '../utils/UserUtils';
const log: debug.IDebugger = debug('app:BusinessAccountService');

@injectable()
export class BusinessAccountService {
  constructor(
    private accountRepository: AccountRepository,
    private businessAccountRepository: BusinessAccountRepository,
    private addressRepository: AddressRepository,
    private businessService: BusinessService,
    private socialMediaPageService: SocialMediaPageService,
    @inject('auth0-authentication-client') private authenticationClient: AuthenticationClient,
    @inject('auth0-management-client') private managementClient: ManagementClient
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
      (businessCreationRequestDTO.socialMediaInfo &&
        SocialMediaPageService.isThereNullValueSocialMediaPageCreationDTO(businessCreationRequestDTO.socialMediaInfo))
    ) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
    }

    const auth0UserData: SignUpUserData = {
      email: businessCreationRequestDTO.account.email,
      password: businessCreationRequestDTO.account.password,
      given_name: businessCreationRequestDTO.account.firstName,
      family_name: businessCreationRequestDTO.account.lastName,
      connection: process.env.AUTH0_CONNECTION as string,
    };

    // Username field is unique, so check if it exist first.
    const checkIfUsernameExist = await this.accountRepository.getByUsername(
      businessCreationRequestDTO.account.username
    );

    if (checkIfUsernameExist) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Username provided already exist');
    }

    // Create business in auth0
    const auth0BusinessAccountData = await this.authenticationClient.database?.signUp(auth0UserData);

    // Assign role in auth0
    await this.managementClient.assignRolestoUser(
      { id: `auth0|${auth0BusinessAccountData?._id}` },
      { roles: [Roles.BUSINESS] }
    );

    const address = await this.addressRepository.create(businessCreationRequestDTO.address);
    businessCreationRequestDTO.account.addressId = address[0].id;

    const businessAccount = await this.businessAccountRepository.create({
      account: businessCreationRequestDTO.account,
    });

    const business = await this.businessService.createBusiness(businessCreationRequestDTO.businessInfo);

    if (businessCreationRequestDTO.socialMediaInfo) {
      businessCreationRequestDTO.socialMediaInfo.email = businessAccount.account.email;
      businessCreationRequestDTO.socialMediaInfo.businessId = business.id;
      await this.socialMediaPageService.createSocialMediaPage(businessCreationRequestDTO.socialMediaInfo);
    }

    return Promise.resolve(businessAccount);
  };

  public getBusinessAccountByEmail = async (email: string, token: string): Promise<BusinessAccount | null> => {
    const currentUser = getCurrentUserEmail(token);

    if (currentUser != email) {
      throw new HttpException(StatusCodes.FORBIDDEN, 'Cannot retrieve this business account.');
    }

    return this.businessAccountRepository.get(email);
  };

  public deleteBusinessAccountByEmail = async (email: string, token: string): Promise<number> => {
    const currentUser = getCurrentUserEmail(token);

    if (currentUser != email) {
      throw new HttpException(StatusCodes.FORBIDDEN, 'Cannot delete this business account.');
    }

    // Get employee data from auth0
    const auth0BusinessAccountData: User<AppMetadata, UserMetadata>[] = await this.managementClient.getUsersByEmail(
      email
    );

    // Delete employee from auth0
    this.managementClient.deleteUser({ id: auth0BusinessAccountData[0]?.user_id as string });

    return this.businessAccountRepository.delete(email);
  };

  public getRedux = async (email: string): Promise<BusinessAccount | null> => {
    return this.businessAccountRepository.getRedux(email);
  };
}
