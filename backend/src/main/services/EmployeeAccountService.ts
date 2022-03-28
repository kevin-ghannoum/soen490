import { AppMetadata, AuthenticationClient, ManagementClient, SignUpUserData, User, UserMetadata, Role } from 'auth0';
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
import AccountRepository from '../repositories/AccountRepository';
import { getProfileRoles } from '../middleware/JWTMiddleware';
import { getCurrentUserEmail } from '../utils/UserUtils';
import WorksOnRepository from '../repositories/WorksOnRepository';
import { WorksOn } from '../models/WorksOn';
import { EmailService } from './EmailService';
const log: debug.IDebugger = debug('app:EmployeeAccountService');

@injectable()
export class EmployeeAccountService {
  constructor(
    private accountRepository: AccountRepository,
    private employeeAccountRepository: EmployeeAccountRepository,
    private addressRepository: AddressRepository,
    private worksOnRepository: WorksOnRepository,
    private emailService: EmailService,
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

    const userData: SignUpUserData = {
      email: employeeAccountRequestDTO.accountRequest.account.email,
      password: employeeAccountRequestDTO.accountRequest.account.password,
      given_name: employeeAccountRequestDTO.accountRequest.account.firstName,
      family_name: employeeAccountRequestDTO.accountRequest.account.lastName,
      connection: process.env.AUTH0_CONNECTION as string,
    };
    // Username field is unique, so check if it exist first.
    const checkIfUsernameExist = await this.accountRepository.getByUsername(
      employeeAccountRequestDTO.accountRequest.account.username
    );

    if (checkIfUsernameExist) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Username provided already exist');
    }
    // Create employee in auth0
    const auth0EmployeeData = await this.authenticationClient.database?.signUp(userData);

    // Assign role in auth0
    await this.managementClient.assignRolestoUser(
      { id: `auth0|${auth0EmployeeData?._id}` },
      { roles: [Roles.EMPLOYEE] }
    );

    // Create address in order to obtain its id for creating an account
    const address = await this.addressRepository.create(employeeAccountRequestDTO.accountRequest.address);
    employeeAccountRequestDTO.accountRequest.account.addressId = address[0].id;
    const { hourlyWage, supervisorEmail, title, businessId } = employeeAccountRequestDTO;

    // Temporary email template.
    const emailContent = `<p>Hi ${employeeAccountRequestDTO.accountRequest.account.firstName}, here are your credentials</p>
        <p>Email: ${employeeAccountRequestDTO.accountRequest.account.email}</p>
        <p>Password: ${employeeAccountRequestDTO.accountRequest.account.password}</p>
        `;
    this.emailService.sendEmail(
      employeeAccountRequestDTO.accountRequest.account.email,
      'Account Credential',
      emailContent
    );

    return this.employeeAccountRepository.create({
      account: employeeAccountRequestDTO.accountRequest.account,
      hourlyWage,
      supervisorEmail,
      title,
      businessId,
    });
  };

  public getEmployeeAccountByEmail = async (
    email: string,
    access_token: string,
    id_token: string
  ): Promise<EmployeeAccount | null> => {
    const userRoles: Role[] = await getProfileRoles(access_token);

    const isEmployee: boolean = this.verifyIfRoleEmployee(userRoles);

    if (isEmployee) {
      const currentUser = getCurrentUserEmail(id_token);

      if (currentUser != email) {
        throw new HttpException(StatusCodes.FORBIDDEN, 'Cannot retrieve this employee account.');
      }
    }

    return this.employeeAccountRepository.get(email);
  };

  private verifyIfRoleEmployee = (userRoles: Role[]): boolean => {
    for (let userRole of userRoles) {
      if ((userRole.name as string) === 'EMPLOYEE') {
        return true;
      }
    }
    return false;
  };

  public getEmployeesByRegex = async (username: string): Promise<EmployeeAccount[] | null> => {
    return this.employeeAccountRepository.getEmployeeRegexUsername(username);
  };

  public getUsernameEmployeeforProject = async (projectId: number): Promise<EmployeeAccount[] | null> => {
    return this.employeeAccountRepository.getUsernameOfEmployeeforProject(projectId);
  };

  public deleteEmployeeAccountByEmail = async (
    email: string,
    access_token: string,
    id_token: string
  ): Promise<number> => {
    const userRoles: Role[] = await getProfileRoles(access_token);

    const isEmployee: boolean = this.verifyIfRoleEmployee(userRoles);

    if (isEmployee) {
      const currentUser = getCurrentUserEmail(id_token);

      if (currentUser != email) {
        throw new HttpException(StatusCodes.FORBIDDEN, 'Cannot delete this employee account.');
      }
    }

    // Get employee data from auth0
    const auth0EmployeeData: User<AppMetadata, UserMetadata>[] = await this.managementClient.getUsersByEmail(email);

    // Delete employee from auth0
    this.managementClient.deleteUser({ id: auth0EmployeeData[0]?.user_id as string });

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
      !employeeAccountRequestDTO.title ||
      !employeeAccountRequestDTO.businessId
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

  public getAllEmployeeAccountsByProject = async (projectId: number): Promise<WorksOn[] | null> => {
    return this.worksOnRepository.get(projectId);
  };

  public getRedux = async (email: string): Promise<EmployeeAccount | null> => {
    return this.employeeAccountRepository.getRedux(email);
  };
}
