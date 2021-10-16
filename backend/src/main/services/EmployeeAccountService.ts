import { AppMetadata, AuthenticationClient, ManagementClient, SignUpUserData, User, UserMetadata } from 'auth0';
import debug from 'debug';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { EmployeeAccountRequestDTO } from '../dto/Accounts/AccountDTOs';
import HttpException from '../exceptions/HttpException';
import { EmployeeAccount } from '../models/EmployeeAccount';
import AddressRepository from '../repositories/AddressRepository';
import EmployeeAccountRepository from '../repositories/EmployeeAccountRepository';
import { AccountService } from './AccountService';
import { Roles } from '../security/Roles';
const log: debug.IDebugger = debug('app:EmployeeAccountService');

@injectable()
export class EmployeeAccountService {
  constructor(
    private employeeAccountRepository: EmployeeAccountRepository,
    private addressRepository: AddressRepository,
    @inject('auth0-authentication-client') private authenticationClient: AuthenticationClient,
    @inject('auth0-management-client') private managementClient: ManagementClient
  ) {
    log('Created instance of EmployeeAccountService');
  }

  public createEmployeeAccount = async (
    employeeAccountRequestDTO: EmployeeAccountRequestDTO
  ): Promise<EmployeeAccount> => {
    if (EmployeeAccountService.isThereNullValueEmployeeAccountDTO(employeeAccountRequestDTO)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
    }

    const auth0Data: SignUpUserData = {
      email: employeeAccountRequestDTO.accountRequest.account.email,
      password: employeeAccountRequestDTO.accountRequest.account.password,
      given_name: employeeAccountRequestDTO.accountRequest.account.firstName,
      family_name: employeeAccountRequestDTO.accountRequest.account.lastName,
      connection: process.env.AUTH0_CONNECTION as string,
    };

    // Create employee in auth0
    const employeeData = await this.authenticationClient.database?.signUp(auth0Data);

    // Assign role in auth0
    await this.managementClient.assignRolestoUser({ id: `auth0|${employeeData?._id}` }, { roles: [Roles.EMPLOYEE] });

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

  public deleteEmployeeAccountByEmail = async (email: string): Promise<number> => {
    // Get employee data from auth0
    const employeeData: User<AppMetadata, UserMetadata>[] = await this.managementClient.getUsersByEmail(email);

    // Delete employee from auth0
    this.managementClient.deleteUser({ id: employeeData[0]?.user_id as string });

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
}
