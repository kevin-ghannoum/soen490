import debug from 'debug';
import { injectable } from 'tsyringe';
import { AccountRequestDTO } from '../dto/Accounts/AccountDTOs';
import AccountRepository from '../repositories/AccountRepository';
const log: debug.IDebugger = debug('app:userService-example');

@injectable()
export class AccountService {
  private accountRepository: AccountRepository;
  constructor(accountRepository: AccountRepository) {
    log('Created instance of AccountService');
    this.accountRepository = accountRepository;
  }

  public static isThereNullValueAccountDTO = (accountRequestDTO: AccountRequestDTO): boolean => {
    if (
      accountRequestDTO === undefined ||
      !accountRequestDTO.address.cityName ||
      !accountRequestDTO.address.civicNumber ||
      !accountRequestDTO.address.country ||
      !accountRequestDTO.address.postalCode ||
      !accountRequestDTO.address.province ||
      !accountRequestDTO.address.streetName ||
      !accountRequestDTO.account.email ||
      !accountRequestDTO.account.firstName ||
      !accountRequestDTO.account.lastName ||
      !accountRequestDTO.account.password ||
      !accountRequestDTO.account.phoneNumber ||
      !accountRequestDTO.account.username
    ) {
      return true;
    }

    return false;
  };
}
