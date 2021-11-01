import debug from 'debug';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'tsyringe';
import { EmployeeAccountRequestDTO } from '../dto/Accounts/AccountDTOs';
import HttpException from '../exceptions/HttpException';
import { EmployeeAccount } from '../models/EmployeeAccount';
import AddressRepository from '../repositories/AddressRepository';
import EmployeeAccountRepository from '../repositories/EmployeeAccountRepository';
import { AccountService } from './AccountService';
const log: debug.IDebugger = debug('app:EmployeeAccountService');

@injectable()
export class EmployeeAccountService {
  constructor(
    private employeeAccountRepository: EmployeeAccountRepository,
    private addressRepository: AddressRepository
  ) {
    log('Created instance of EmployeeAccountService');
  }

  public createEmployeeAccount = async (
    employeeAccountRequestDTO: EmployeeAccountRequestDTO
  ): Promise<EmployeeAccount> => {
    if (EmployeeAccountService.isThereNullValueEmployeeAccountDTO(employeeAccountRequestDTO)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
    }

    // Create address in order to obtain its id for creating an account
    const address = await this.addressRepository.create(employeeAccountRequestDTO.accountRequest.address);
    employeeAccountRequestDTO.accountRequest.account.addressId = address[0].id;
    const { hourlyWage, supervisorEmail, title } = employeeAccountRequestDTO;

    return this.employeeAccountRepository.create({
      account: employeeAccountRequestDTO.accountRequest.account,
      hourlyWage,
      supervisorEmail,
      title,
    });
  };

  public getEmployeeAccountByEmail = async (email: string): Promise<EmployeeAccount | null> => {
    return this.employeeAccountRepository.get(email);
  };

  public getEmployeesByRegex = async (email: string): Promise<EmployeeAccount[] | null> => {
    return this.employeeAccountRepository.getEmployeesByRegex(email);
  };

  public deleteEmployeeAccountByEmail = async (email: string): Promise<number> => {
    return this.employeeAccountRepository.delete(email);
  };

  public static isThereNullValueEmployeeAccountDTO = (
    employeeAccountRequestDTO: EmployeeAccountRequestDTO
  ): boolean => {
    if (
      employeeAccountRequestDTO === undefined ||
      !employeeAccountRequestDTO.accountRequest ||
      !employeeAccountRequestDTO.hourlyWage ||
      !employeeAccountRequestDTO.supervisorEmail ||
      !employeeAccountRequestDTO.title
    ) {
      return true;
    }

    return AccountService.isThereNullValueAccountDTO(employeeAccountRequestDTO.accountRequest);
  };

  public getAllEmployeeAccounts = async (): Promise<EmployeeAccount[] | null> => {
    return this.employeeAccountRepository.getAll();
  };

  public getAllEmployeeAccountsByBusiness = async (businessEmail: string): Promise<EmployeeAccount[] | null> => {
    return this.employeeAccountRepository.getAllByBusiness(businessEmail);
  };
}
