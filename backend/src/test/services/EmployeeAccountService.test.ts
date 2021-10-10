import { mock } from 'jest-mock-extended';
import path from 'path';
import 'reflect-metadata';
import { Sequelize } from 'sequelize-typescript';
import { container } from 'tsyringe';
import { EmployeeAccountRequestDTO } from '../../main/dto/Accounts/AccountDTOs';
import { Account } from '../../main/models/Account';
import { Address } from '../../main/models/Address';
import { EmployeeAccount } from '../../main/models/EmployeeAccount';
import AddressRepository from '../../main/repositories/AddressRepository';
import EmployeeAccountRepository from '../../main/repositories/EmployeeAccountRepository';
import { EmployeeAccountService } from '../../main/services/EmployeeAccountService';

describe('Employee Account test', () => {
  let employeeAccountRepositoryMock: any = null;
  let addressRepositoryMock: any = null;

  new Sequelize({
    validateOnly: true,
    models: [path.join(__dirname, '../../main/models', '*.ts')],
  });

  beforeEach(() => {
    employeeAccountRepositoryMock = mock<EmployeeAccountRepository>();
    addressRepositoryMock = mock<AddressRepository>();
    container.registerInstance(EmployeeAccountRepository, employeeAccountRepositoryMock);
    container.registerInstance(AddressRepository, addressRepositoryMock);
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
    };

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
