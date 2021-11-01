import debug from 'debug';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'tsyringe';
import { ClientAccountCreationRequestDTO } from '../dto/Accounts/AccountDTOs';
import HttpException from '../exceptions/HttpException';
import { Address } from '../models/Address';
import { ClientAccount } from '../models/ClientAccount';
import AddressRepository from '../repositories/AddressRepository';
import ClientAccountRepository from '../repositories/ClientAccountRepository';
import { AccountService } from './AccountService';
import { SocialMediaPageService } from './SocialMediaPageService';
const log: debug.IDebugger = debug('app:ClientAccountService');

@injectable()
export class ClientAccountService {
  constructor(
    private clientAccountRepository: ClientAccountRepository,
    private addressRepository: AddressRepository,
    private socialMediaPageService: SocialMediaPageService
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
      SocialMediaPageService.isThereNullValueSocialMediaPageCreationDTO(clientAccountCreationRequestDTO.socialMediaInfo)
    ) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
    }

    const address: [Address, boolean] = await this.addressRepository.create(clientAccountCreationRequestDTO.address);
    clientAccountCreationRequestDTO.account.addressId = address[0].id;
    const clientAccount: ClientAccount = await this.clientAccountRepository.create({
      account: clientAccountCreationRequestDTO.account,
      businessName: clientAccountCreationRequestDTO.businessName,
      industry: clientAccountCreationRequestDTO.industry,
      status: clientAccountCreationRequestDTO.status,
      website: clientAccountCreationRequestDTO.website,
    });

    clientAccountCreationRequestDTO.socialMediaInfo.email = clientAccount.account.email;
    await this.socialMediaPageService.createSocialMediaPage(clientAccountCreationRequestDTO.socialMediaInfo);

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
      !clientAccountCreationRequestDTO.status ||
      !clientAccountCreationRequestDTO.website
    ) {
      return true;
    }

    return false;
  };
}
