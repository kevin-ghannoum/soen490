import 'reflect-metadata';
import { mock } from 'jest-mock-extended';
import { container } from 'tsyringe';
import BusinessAccountRepository from '../../main/repositories/BusinessAccountRepository';
import AddressRepository from '../../main/repositories/AddressRepository';
import { BusinessCreationRequestDTO } from '../../main/dto/Accounts/AccountDTOs';
import { Address } from '../../main/models/Address';
import { BusinessAccount } from '../../main/models/BusinessAccount';
import { Account } from '../../main/models/Account';
import BusinessRepository from '../../main/repositories/BusinessRepository';
import { Business } from '../../main/models/Business';
import SocialMediaPageRepository from '../../main/repositories/SocialMediaPageRepository';
import { SocialMediaPage } from '../../main/models/SocialMediaPage';
import { BusinessAccountService } from '../../main/services/BusinessAccountService';
import { AuthenticationClient, ManagementClient } from 'auth0';
import { sequelizeMock } from '../helpers/SequelizeMock';

describe('BusinessAccountService tests', () => {
  let businessAccountRepositoryMock: any = null;
  let addressRepositoryMock: any = null;
  let businessRepositoryMock: any = null;
  let socialMediaPageRepositoryMock: any = null;
  let authenticationClientMock: any = null;
  let managementClientMock: any = null;

  beforeAll(() => {
    sequelizeMock();
  });

  beforeEach(() => {
    businessAccountRepositoryMock = mock<BusinessAccountRepository>();
    addressRepositoryMock = mock<AddressRepository>();
    businessRepositoryMock = mock<BusinessRepository>();
    socialMediaPageRepositoryMock = mock<SocialMediaPageRepository>();
    authenticationClientMock = mock<AuthenticationClient>();
    managementClientMock = mock<ManagementClient>();

    container.registerInstance(BusinessAccountRepository, businessAccountRepositoryMock);
    container.registerInstance(AddressRepository, addressRepositoryMock);
    container.registerInstance(BusinessRepository, businessRepositoryMock);
    container.registerInstance(SocialMediaPageRepository, socialMediaPageRepositoryMock);
    container.register<AuthenticationClient>('auth0-authentication-client', {
      useFactory: () => authenticationClientMock,
    });
    container.register<ManagementClient>('auth0-management-client', { useFactory: () => managementClientMock });
  });

  afterEach(() => {
    container.clearInstances();
  });

  it('should create a business account', async () => {
    const NEW_BUSINESS_ACCCOUNT_INFO: BusinessCreationRequestDTO = {
      account: {
        email: 'business@gmail.com',
        firstName: 'bob',
        lastName: 'bob',
        phoneNumber: '5145555555',
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
      businessInfo: {
        name: 'Bob Store',
        industry: 'clothing',
        website: 'simon.com',
        email: 'business@gmail.com',
      },
      socialMediaInfo: {
        name: 'instagram',
        link: 'instagram.com',
      },
    };

    authenticationClientMock.database.signUp = jest.fn().mockResolvedValue({
      given_name: 'test',
      family_name: 'test',
      _id: '61818a29369f4f0069c892c0',
      email_verified: false,
      email: 'test@gmail.com',
    });

    managementClientMock.assignRolestoUser.mockResolvedValue(() => Promise.resolve());

    addressRepositoryMock.create.mockResolvedValue([
      Address.build({
        id: 1,
        ...NEW_BUSINESS_ACCCOUNT_INFO.address,
      }),
      true,
    ]);

    businessAccountRepositoryMock.create.mockResolvedValue(
      BusinessAccount.build({ account: NEW_BUSINESS_ACCCOUNT_INFO.account }, { include: [Account] })
    );

    businessRepositoryMock.create.mockResolvedValue(
      Business.build({ id: 4, ...NEW_BUSINESS_ACCCOUNT_INFO.businessInfo })
    );

    socialMediaPageRepositoryMock.create.mockResolvedValue(
      SocialMediaPage.build({
        ...NEW_BUSINESS_ACCCOUNT_INFO.socialMediaInfo,
        businessId: 4,
        email: NEW_BUSINESS_ACCCOUNT_INFO.account.email,
      })
    );

    const businessAccountService = container.resolve(BusinessAccountService);
    const result = await businessAccountService.createBusinessAccount(NEW_BUSINESS_ACCCOUNT_INFO);
    expect(result.account.email).toBe(NEW_BUSINESS_ACCCOUNT_INFO.account.email);
  });

  it('should create a business account without social media', async () => {
    const NEW_BUSINESS_ACCCOUNT_INFO: BusinessCreationRequestDTO = {
      account: {
        email: 'business@gmail.com',
        firstName: 'bob',
        lastName: 'bob',
        phoneNumber: '5145555555',
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
      businessInfo: {
        name: 'Bob Store',
        industry: 'clothing',
        website: 'simon.com',
        email: 'business@gmail.com',
      },
    };

    authenticationClientMock.database.signUp = jest.fn().mockResolvedValue({
      given_name: 'test',
      family_name: 'test',
      _id: '61818a29369f4f0069c892c0',
      email_verified: false,
      email: 'test@gmail.com',
    });

    managementClientMock.assignRolestoUser.mockResolvedValue(() => Promise.resolve());

    addressRepositoryMock.create.mockResolvedValue([
      Address.build({
        id: 1,
        ...NEW_BUSINESS_ACCCOUNT_INFO.address,
      }),
      true,
    ]);

    businessAccountRepositoryMock.create.mockResolvedValue(
      BusinessAccount.build({ account: NEW_BUSINESS_ACCCOUNT_INFO.account }, { include: [Account] })
    );

    businessRepositoryMock.create.mockResolvedValue(
      Business.build({ id: 4, ...NEW_BUSINESS_ACCCOUNT_INFO.businessInfo })
    );

    const businessAccountService = container.resolve(BusinessAccountService);
    const result = await businessAccountService.createBusinessAccount(NEW_BUSINESS_ACCCOUNT_INFO);
    expect(result.account.email).toBe(NEW_BUSINESS_ACCCOUNT_INFO.account.email);
  });

  it('should fail because of missing data in request in account (firstName)', async () => {
    const NEW_BUSINESS_ACCCOUNT_INFO: any = {
      account: {
        email: 'business@gmail.com',
        lastName: 'bob',
        phoneNumber: '5145555555',
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
      businessInfo: {
        name: 'Bob Store',
        industry: 'clothing',
        website: 'simon.com',
        email: 'business@gmail.com',
      },
      socialMediaInfo: {
        name: 'instagram',
        link: 'instagram.com',
      },
    };

    const businessAccountService = container.resolve(BusinessAccountService);
    await expect(
      businessAccountService.createBusinessAccount(NEW_BUSINESS_ACCCOUNT_INFO as BusinessCreationRequestDTO)
    ).rejects.toThrowError('Request data is missing some values');
  });

  it('should fail because of missing data in request in address (civicNumber)', async () => {
    const NEW_BUSINESS_ACCCOUNT_INFO: any = {
      account: {
        email: 'business@gmail.com',
        firstName: 'bob',
        lastName: 'bob',
        phoneNumber: '5145555555',
        username: 'bob',
        password: 'bob',
        addressId: 1,
      },
      address: {
        streetName: 'St-Catherine',
        postalCode: 'H6Y 8U6',
        cityName: 'MTL',
        province: 'QC',
        country: 'Canada',
      },
      businessInfo: {
        name: 'Bob Store',
        industry: 'clothing',
        website: 'simon.com',
        email: 'business@gmail.com',
      },
      socialMediaInfo: {
        name: 'instagram',
        link: 'instagram.com',
      },
    };

    const businessAccountService = container.resolve(BusinessAccountService);
    await expect(
      businessAccountService.createBusinessAccount(NEW_BUSINESS_ACCCOUNT_INFO as BusinessCreationRequestDTO)
    ).rejects.toThrowError('Request data is missing some values');
  });

  it('should fail because of missing data in request in business info (industry)', async () => {
    const NEW_BUSINESS_ACCCOUNT_INFO: any = {
      account: {
        email: 'business@gmail.com',
        firstName: 'bob',
        lastName: 'bob',
        phoneNumber: '5145555555',
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
      businessInfo: {
        name: 'Bob Store',
        website: 'simon.com',
        email: 'business@gmail.com',
      },
      socialMediaInfo: {
        name: 'instagram',
        link: 'instagram.com',
      },
    };

    const businessAccountService = container.resolve(BusinessAccountService);
    await expect(
      businessAccountService.createBusinessAccount(NEW_BUSINESS_ACCCOUNT_INFO as BusinessCreationRequestDTO)
    ).rejects.toThrowError('Request data is missing some values');
  });

  it('should fail because of missing data in request socialMedia (name)', async () => {
    const NEW_BUSINESS_ACCCOUNT_INFO: any = {
      account: {
        email: 'business@gmail.com',
        firstName: 'bob',
        lastName: 'bob',
        phoneNumber: '5145555555',
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
      businessInfo: {
        name: 'Bob Store',
        industry: 'clothing',
        website: 'simon.com',
        email: 'business@gmail.com',
      },
      socialMediaInfo: {
        link: 'instagram.com',
      },
    };

    const businessAccountService = container.resolve(BusinessAccountService);
    await expect(
      businessAccountService.createBusinessAccount(NEW_BUSINESS_ACCCOUNT_INFO as BusinessCreationRequestDTO)
    ).rejects.toThrowError('Request data is missing some values');
  });
});
