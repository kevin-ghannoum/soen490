import 'reflect-metadata';
import { mock } from 'jest-mock-extended';
import { container } from 'tsyringe';
import { EmployeeAccountRequestDTO } from '../../main/dto/Accounts/AccountDTOs';
import { Account } from '../../main/models/Account';
import { Address } from '../../main/models/Address';
import { EmployeeAccount } from '../../main/models/EmployeeAccount';
import AddressRepository from '../../main/repositories/AddressRepository';
import EmployeeAccountRepository from '../../main/repositories/EmployeeAccountRepository';
import { EmployeeAccountService } from '../../main/services/EmployeeAccountService';
import { AuthenticationClient, ManagementClient } from 'auth0';
import { sequelizeMock } from '../helpers/SequelizeMock';
import AccountRepository from '../../main/repositories/AccountRepository';

describe('Employee Account test', () => {
  let employeeAccountRepositoryMock: any = null;
  let addressRepositoryMock: any = null;
  let authenticationClientMock: any = null;
  let managementClientMock: any = null;
  let accountRepositoryMock: any = null;

  beforeAll(() => {
    sequelizeMock();
  });

  beforeEach(() => {
    accountRepositoryMock = mock<AccountRepository>();
    employeeAccountRepositoryMock = mock<EmployeeAccountRepository>();
    addressRepositoryMock = mock<AddressRepository>();
    authenticationClientMock = mock<AuthenticationClient>();
    managementClientMock = mock<ManagementClient>();

    container.registerInstance(AccountRepository, accountRepositoryMock);
    container.registerInstance(EmployeeAccountRepository, employeeAccountRepositoryMock);
    container.registerInstance(AddressRepository, addressRepositoryMock);
    container.register<AuthenticationClient>('auth0-authentication-client', { useFactory: () => authenticationClientMock });
    container.register<ManagementClient>('auth0-management-client', { useFactory: () => managementClientMock });
  });

  afterEach(() => {
    container.clearInstances();
  });

  it('should create an employee account', async () => {
    const newEmployeeInfo: EmployeeAccountRequestDTO = {
      accountRequest: {
        account: {
          email: 'bob@gmail.com',
          firstName: 'bob',
          lastName: 'bob',
          phoneNumber: '53434234',
          username: 'bob',
          password: 'bob',
          addressId: 2098,
        },
        address: {
          civicNumber: 927,
          streetName: 'des clematites',
          postalCode: 'H7Y0A7',
          cityName: 'Laval',
          province: 'QC',
          country: 'Canada',
        },
      },
      hourlyWage: 40,
      title: 'Supervisor',
      supervisorEmail: 'bob@gmail.com',
      businessId:1
    };

    accountRepositoryMock.getByUsername.mockResolvedValue(null);
    
    addressRepositoryMock.create.mockResolvedValue([
      Address.build({
        id: 2098,
        civicNumber: 927,
        streetName: 'des clematites',
        postalCode: 'H7Y0A7',
        cityName: 'Laval',
        province: 'QC',
        country: 'Canada',
      }),
      true,
    ]);

    employeeAccountRepositoryMock.create.mockResolvedValue(
      EmployeeAccount.build(
        {
          account: newEmployeeInfo.accountRequest.account,
          hourlyWage: newEmployeeInfo.hourlyWage,
          supervisorEmail: newEmployeeInfo.supervisorEmail,
          title: newEmployeeInfo.title,
        },
        { include: [Account] }
      )
    );

    authenticationClientMock.database.signUp = jest.fn().mockResolvedValue(
        {
          given_name: 'test',
          family_name: 'test',
          _id: '61818a29369f4f0069c892c0',
          email_verified: false,
          email: 'test@gmail.com'
        }
      );

      managementClientMock.assignRolestoUser.mockResolvedValue(() => Promise.resolve()); 

    const employeeAccountService: EmployeeAccountService = container.resolve(EmployeeAccountService);
    const result = await employeeAccountService.createEmployeeAccount(newEmployeeInfo);
    expect(result.account.email).toBe('bob@gmail.com');
  });

  it('should fail because of missing value in request data (missing hourly wage)', async () => {
    const newEmployeeInfo = {
      accountRequest: {
        account: {
          email: 'bob@gmail.com',
          firstName: 'bob',
          lastName: 'bob',
          phoneNumber: '53434234',
          username: 'bob',
          password: 'bob',
          addressId: 2098,
        },
        address: {
          civicNumber: 927,
          streetName: 'des clematites',
          postalCode: 'H7Y0A7',
          cityName: 'Laval',
          province: 'QC',
          country: 'Canada',
        },
      },
      title: 'Supervisor',
      supervisorEmail: 'bob@gmail.com',
    };

    const employeeAccountService: EmployeeAccountService = container.resolve(EmployeeAccountService);
    await expect(
      employeeAccountService.createEmployeeAccount(newEmployeeInfo as EmployeeAccountRequestDTO)
    ).rejects.toThrowError('Request data is missing some values');
  });
});
