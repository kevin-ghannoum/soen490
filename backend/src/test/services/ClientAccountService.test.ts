import 'reflect-metadata';
import { mock } from 'jest-mock-extended';
import { container } from 'tsyringe';
import { ClientAccountCreationRequestDTO, Status } from '../../main/dto/Accounts/AccountDTOs';
import { Account } from '../../main/models/Account';
import { Address } from '../../main/models/Address';
import { ClientAccount } from '../../main/models/ClientAccount';
import { SocialMediaPage } from '../../main/models/SocialMediaPage';
import AddressRepository from '../../main/repositories/AddressRepository';
import ClientAccountRepository from '../../main/repositories/ClientAccountRepository';
import SocialMediaPageRepository from '../../main/repositories/SocialMediaPageRepository';
import { ClientAccountService } from '../../main/services/ClientAccountService';
import { sequelizeMock } from '../helpers/SequelizeMock';
import { AuthenticationClient, ManagementClient } from 'auth0';

describe('ClientAccountService tests', () => {
  let clientAccountRepositoryMock: any = null;
  let addressRepositoryMock: any = null;
  let socialMediaPageRepositoryMock: any = null;
  let authenticationClientMock: any = null;
  let managementClientMock: any = null;

  beforeAll(() => {
    sequelizeMock();
  });

  beforeEach(() => {
    clientAccountRepositoryMock = mock<ClientAccountRepository>();
    addressRepositoryMock = mock<AddressRepository>();
    socialMediaPageRepositoryMock = mock<SocialMediaPageRepository>();
    authenticationClientMock = mock<AuthenticationClient>();
    managementClientMock = mock<ManagementClient>();
    container.registerInstance(ClientAccountRepository, clientAccountRepositoryMock);
    container.registerInstance(AddressRepository, addressRepositoryMock);
    container.registerInstance(SocialMediaPageRepository, socialMediaPageRepositoryMock);
    container.register<AuthenticationClient>('auth0-authentication-client', {
      useFactory: () => authenticationClientMock,
    });
    container.register<ManagementClient>('auth0-management-client', { useFactory: () => managementClientMock });
  });

  afterEach(() => {
    container.clearInstances();
  });

  it('should create a client account', async () => {
    const NEW_CLIENT_ACCOUNT_INFO: ClientAccountCreationRequestDTO = {
      account: {
        email: 'client@gmail.com',
        firstName: 'bob',
        lastName: 'bob',
        phoneNumber: '53434234',
        username: 'bob',
        password: 'bob',
        addressId: 1,
      },
      address: {
        civicNumber: 111,
        streetName: 'St-Catherine',
        postalCode: 'H6Y 8U6',
        cityName: 'MTL',
        province: 'QC',
        country: 'Canada',
      },
      businessName: 'Bob store',
      industry: 'clothing',
      website: 'bob.com',
      status: Status['REJECTED' as keyof typeof Status],
      socialMediaInfo: {
        name: 'instagram',
        link: 'instagram.com',
      },
    };

    authenticationClientMock.database.signUp = jest.fn().mockResolvedValue({
      given_name: 'bob',
      family_name: 'bob',
      _id: '61818a29369f4f0069c892c0',
      email_verified: false,
      email: 'client@gmail.com',
    });

    managementClientMock.assignRolestoUser.mockResolvedValue(() => Promise.resolve());

    addressRepositoryMock.create.mockResolvedValue([
      Address.build({
        id: 1,
        ...NEW_CLIENT_ACCOUNT_INFO.address,
      }),
      true,
    ]);

    clientAccountRepositoryMock.create.mockResolvedValue(
      ClientAccount.build(
        {
          account: NEW_CLIENT_ACCOUNT_INFO.account,
          businessName: NEW_CLIENT_ACCOUNT_INFO.businessName,
          industry: NEW_CLIENT_ACCOUNT_INFO.industry,
          website: NEW_CLIENT_ACCOUNT_INFO.website,
          status: NEW_CLIENT_ACCOUNT_INFO.status,
        },
        { include: [Account] }
      )
    );

    socialMediaPageRepositoryMock.create.mockResolvedValue(
      SocialMediaPage.build({
        ...NEW_CLIENT_ACCOUNT_INFO.socialMediaInfo,
        email: NEW_CLIENT_ACCOUNT_INFO.account.email,
      })
    );

    const clientAccountService: ClientAccountService = container.resolve(ClientAccountService);
    const result = await clientAccountService.createClientAccount(NEW_CLIENT_ACCOUNT_INFO);
    expect(result.account.email).toBe(NEW_CLIENT_ACCOUNT_INFO.account.email);
  });

  it('should create a client account without social media', async () => {
    const NEW_CLIENT_ACCOUNT_INFO: ClientAccountCreationRequestDTO = {
      account: {
        email: 'client@gmail.com',
        firstName: 'bob',
        lastName: 'bob',
        phoneNumber: '53434234',
        username: 'bob',
        password: 'bob',
        addressId: 1,
      },
      address: {
        civicNumber: 111,
        streetName: 'St-Catherine',
        postalCode: 'H6Y 8U6',
        cityName: 'MTL',
        province: 'QC',
        country: 'Canada',
      },
      businessName: 'Bob store',
      industry: 'clothing',
      website: 'bob.com',
      status: Status['REJECTED' as keyof typeof Status],
      socialMediaInfo: {
        name: 'instagram',
        link: 'instagram.com',
      },
    };
    
    authenticationClientMock.database.signUp = jest.fn().mockResolvedValue({
      given_name: 'bob',
      family_name: 'bob',
      _id: '61818a29369f4f0069c892c0',
      email_verified: false,
      email: 'client@gmail.com',
    });

    managementClientMock.assignRolestoUser.mockResolvedValue(() => Promise.resolve());

    addressRepositoryMock.create.mockResolvedValue([
      Address.build({
        id: 1,
        ...NEW_CLIENT_ACCOUNT_INFO.address,
      }),
      true,
    ]);

    clientAccountRepositoryMock.create.mockResolvedValue(
      ClientAccount.build(
        {
          account: NEW_CLIENT_ACCOUNT_INFO.account,
          businessName: NEW_CLIENT_ACCOUNT_INFO.businessName,
          industry: NEW_CLIENT_ACCOUNT_INFO.industry,
          website: NEW_CLIENT_ACCOUNT_INFO.website,
          status: NEW_CLIENT_ACCOUNT_INFO.status,
        },
        { include: [Account] }
      )
    );

    const clientAccountService: ClientAccountService = container.resolve(ClientAccountService);
    const result = await clientAccountService.createClientAccount(NEW_CLIENT_ACCOUNT_INFO);
    expect(result.account.email).toBe(NEW_CLIENT_ACCOUNT_INFO.account.email);
  });

  it('should fail because of missing data in request business name', async () => {
    const NEW_CLIENT_ACCOUNT_INFO = {
      account: {
        firstName: 'bob',
        lastName: 'bob',
        phoneNumber: '53434234',
        username: 'bob',
        password: 'bob',
        addressId: 1,
      },
      address: {
        civicNumber: 111,
        streetName: 'St-Catherine',
        postalCode: 'H6Y 8U6',
        cityName: 'MTL',
        province: 'QC',
        country: 'Canada',
      },
      businessName: 'Bob store',
      industry: 'clothing',
      website: 'bob.com',
      status: Status['REJECTED' as keyof typeof Status],
      socialMediaInfo: {
        name: 'instagram',
        link: 'instagram.com',
      },
    };

    const clientAccountService: ClientAccountService = container.resolve(ClientAccountService);
    await expect(
      clientAccountService.createClientAccount(NEW_CLIENT_ACCOUNT_INFO as ClientAccountCreationRequestDTO)
    ).rejects.toThrowError('Request data is missing some values');
  });

  it('should fail because of missing data in request businessName', async () => {
    const NEW_CLIENT_ACCOUNT_INFO = {
      account: {
        email: 'client@gmail.com',
        firstName: 'bob',
        lastName: 'bob',
        phoneNumber: '53434234',
        username: 'bob',
        password: 'bob',
        addressId: 1,
      },
      address: {
        civicNumber: 111,
        streetName: 'St-Catherine',
        postalCode: 'H6Y 8U6',
        cityName: 'MTL',
        province: 'QC',
        country: 'Canada',
      },
      industry: 'clothing',
      website: 'bob.com',
      status: Status['REJECTED' as keyof typeof Status],
      socialMediaInfo: {
        name: 'instagram',
        link: 'instagram.com',
      },
    };

    const clientAccountService: ClientAccountService = container.resolve(ClientAccountService);
    await expect(
      clientAccountService.createClientAccount(NEW_CLIENT_ACCOUNT_INFO as ClientAccountCreationRequestDTO)
    ).rejects.toThrowError('Request data is missing some values');
  });

  it('should fail because of missing data in request industry', async () => {
    const NEW_CLIENT_ACCOUNT_INFO = {
      account: {
        email: 'client@gmail.com',
        firstName: 'bob',
        lastName: 'bob',
        phoneNumber: '53434234',
        username: 'bob',
        password: 'bob',
        addressId: 1,
      },
      address: {
        civicNumber: 111,
        streetName: 'St-Catherine',
        postalCode: 'H6Y 8U6',
        cityName: 'MTL',
        province: 'QC',
        country: 'Canada',
      },
      businessName: 'bob store',
      website: 'bob.com',
      status: Status['REJECTED' as keyof typeof Status],
      socialMediaInfo: {
        name: 'instagram',
        link: 'instagram.com',
      },
    };

    const clientAccountService: ClientAccountService = container.resolve(ClientAccountService);
    await expect(
      clientAccountService.createClientAccount(NEW_CLIENT_ACCOUNT_INFO as ClientAccountCreationRequestDTO)
    ).rejects.toThrowError('Request data is missing some values');
  });

  it('should fail because of missing data in request status', async () => {
    const NEW_CLIENT_ACCOUNT_INFO = {
      account: {
        email: 'client@gmail.com',
        firstName: 'bob',
        lastName: 'bob',
        phoneNumber: '53434234',
        username: 'bob',
        password: 'bob',
        addressId: 1,
      },
      address: {
        civicNumber: 111,
        streetName: 'St-Catherine',
        postalCode: 'H6Y 8U6',
        cityName: 'MTL',
        province: 'QC',
        country: 'Canada',
      },
      businessName: 'Bob store',
      industry: 'clothing',
      website: 'bob.com',
      socialMediaInfo: {
        name: 'instagram',
        link: 'instagram.com',
      },
    };

    const clientAccountService: ClientAccountService = container.resolve(ClientAccountService);
    await expect(
      clientAccountService.createClientAccount(NEW_CLIENT_ACCOUNT_INFO as ClientAccountCreationRequestDTO)
    ).rejects.toThrowError('Request data is missing some values');
  });

  it('should fail because of missing data in request social media info name', async () => {
    const NEW_CLIENT_ACCOUNT_INFO = {
      account: {
        email: 'client@gmail.com',
        firstName: 'bob',
        lastName: 'bob',
        phoneNumber: '53434234',
        username: 'bob',
        password: 'bob',
        addressId: 1,
      },
      address: {
        civicNumber: 111,
        streetName: 'St-Catherine',
        postalCode: 'H6Y 8U6',
        cityName: 'MTL',
        province: 'QC',
        country: 'Canada',
      },
      businessName: 'Bob store',
      industry: 'clothing',
      website: 'bob.com',
      status: Status['REJECTED' as keyof typeof Status],
      socialMediaInfo: {
        link: 'instagram.com',
      },
    };

    const clientAccountService: ClientAccountService = container.resolve(ClientAccountService);
    await expect(
      clientAccountService.createClientAccount(NEW_CLIENT_ACCOUNT_INFO as ClientAccountCreationRequestDTO)
    ).rejects.toThrowError('Request data is missing some values');
  });

  it('should fail because of missing data in request social media info link', async () => {
    const NEW_CLIENT_ACCOUNT_INFO = {
      account: {
        email: 'client@gmail.com',
        firstName: 'bob',
        lastName: 'bob',
        phoneNumber: '53434234',
        username: 'bob',
        password: 'bob',
        addressId: 1,
      },
      address: {
        civicNumber: 111,
        streetName: 'St-Catherine',
        postalCode: 'H6Y 8U6',
        cityName: 'MTL',
        province: 'QC',
        country: 'Canada',
      },
      businessName: 'Bob store',
      industry: 'clothing',
      website: 'bob.com',
      status: Status['REJECTED' as keyof typeof Status],
      socialMediaInfo: {
        name: 'instagram',
      },
    };

    const clientAccountService: ClientAccountService = container.resolve(ClientAccountService);
    await expect(
      clientAccountService.createClientAccount(NEW_CLIENT_ACCOUNT_INFO as ClientAccountCreationRequestDTO)
    ).rejects.toThrowError('Request data is missing some values');
  });
});
