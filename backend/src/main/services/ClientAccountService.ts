import { AuthenticationClient, ManagementClient, SignUpUserData } from 'auth0';
import debug from 'debug';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { ClientAccountCreationRequestDTO } from '../dto/Accounts/AccountDTOs';
import HttpException from '../exceptions/HttpException';
import { Address } from '../models/Address';
import { ClientAccount } from '../models/ClientAccount';
import AddressRepository from '../repositories/AddressRepository';
import ClientAccountRepository from '../repositories/ClientAccountRepository';
import { Roles } from '../security/Roles';
import { AccountService } from './AccountService';
import { SocialMediaPageService } from './SocialMediaPageService';
const log: debug.IDebugger = debug('app:ClientAccountService');

@injectable()
export class ClientAccountService {
  constructor(
    private clientAccountRepository: ClientAccountRepository,
    private addressRepository: AddressRepository,
    private socialMediaPageService: SocialMediaPageService,
    @inject('auth0-authentication-client') private authenticationClient: AuthenticationClient,
    @inject('auth0-management-client') private managementClient: ManagementClient
  ) {
    log('Created instance of ClientAccountService');
  }

  public createClientAccount = async (
    clientAccountCreationRequestDTO: ClientAccountCreationRequestDTO
  ): Promise<ClientAccount> => {
    if (
      AccountService.isThereNullValueAccountDTO({
        account: clientAccountCreationRequestDTO.account,
        address: clientAccountCreationRequestDTO.address,
      }) ||
      ClientAccountService.isThereNullClientAccountCreationRequestDTO(clientAccountCreationRequestDTO) ||
      (clientAccountCreationRequestDTO.socialMediaInfo &&
        SocialMediaPageService.isThereNullValueSocialMediaPageCreationDTO(
          clientAccountCreationRequestDTO.socialMediaInfo
        ))
    ) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
    }

    const auth0UserData: SignUpUserData = {
      email: clientAccountCreationRequestDTO.account.email,
      password: clientAccountCreationRequestDTO.account.password,
      given_name: clientAccountCreationRequestDTO.account.firstName,
      family_name: clientAccountCreationRequestDTO.account.lastName,
      connection: process.env.AUTH0_CONNECTION as string,
    };

    // Create client in auth0
    const auth0ClientAccountData = await this.authenticationClient.database?.signUp(auth0UserData);

    // Assign role in auth0
    await this.managementClient.assignRolestoUser(
      { id: `auth0|${auth0ClientAccountData?._id}` },
      { roles: [Roles.CLIENT] }
    );

    const address: [Address, boolean] = await this.addressRepository.create(clientAccountCreationRequestDTO.address);
    clientAccountCreationRequestDTO.account.addressId = address[0].id;
    const clientAccount: ClientAccount = await this.clientAccountRepository.create({
      account: clientAccountCreationRequestDTO.account,
      businessName: clientAccountCreationRequestDTO.businessName,
      industry: clientAccountCreationRequestDTO.industry,
      status: clientAccountCreationRequestDTO.status,
      website: clientAccountCreationRequestDTO.website,
    });

    if (clientAccountCreationRequestDTO.socialMediaInfo) {
      clientAccountCreationRequestDTO.socialMediaInfo.email = clientAccount.account.email;
      await this.socialMediaPageService.createSocialMediaPage(clientAccountCreationRequestDTO.socialMediaInfo);
    }

    return Promise.resolve(clientAccount);
  };

  public getClientAccountByEmail = async (email: string): Promise<ClientAccount | null> => {
    return this.clientAccountRepository.get(email);
  };

  public deleteClientAccountByEmail = async (email: string): Promise<number> => {
    return this.clientAccountRepository.delete(email);
  };

  public static isThereNullClientAccountCreationRequestDTO = (
    clientAccountCreationRequestDTO: ClientAccountCreationRequestDTO
  ): boolean => {
    if (
      clientAccountCreationRequestDTO === undefined ||
      !clientAccountCreationRequestDTO.businessName ||
      !clientAccountCreationRequestDTO.industry ||
      !clientAccountCreationRequestDTO.status
    ) {
      return true;
    }

    return false;
  };
  public getAllClientAccount = async (): Promise<ClientAccount[] | null> => {
    return this.clientAccountRepository.getAll();
  };

  public getEmployeesByRegex = async (email: string): Promise<ClientAccount[] | null> => {
    return this.clientAccountRepository.getClientsByRegex(email);
  };

  public getRedux = async (email: string): Promise<ClientAccount | null> => {
    return this.clientAccountRepository.getRedux(email);
  };
}
