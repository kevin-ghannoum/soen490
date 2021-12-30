import 'reflect-metadata';
import { mock } from 'jest-mock-extended';
import { container } from 'tsyringe';
import { BusinessCreationDTO } from '../../main/dto/BusinessDTO';
import { Business } from '../../main/models/Business';
import BusinessRepository from '../../main/repositories/BusinessRepository';
import { BusinessService } from '../../main/services/BusinessService';
import { sequelizeMock } from '../helpers/SequelizeMock';

describe('BusinessService tests', () => {
  let businessRepositoryMock: any = null;

  beforeAll(() => {
    sequelizeMock();
  });

  beforeEach(() => {
    businessRepositoryMock = mock<BusinessRepository>();
    container.registerInstance(BusinessRepository, businessRepositoryMock);
  });

  afterEach(() => {
    container.clearInstances();
  });

  it('should create business', async () => {
    const BUSINESS_REQUEST: BusinessCreationDTO = {
      name: 'Test store',
      industry: 'Clothing',
      email: 'TestStore@test.com',
      website: 'test.com',
    };

    businessRepositoryMock.create.mockResolvedValue(Business.build(BUSINESS_REQUEST));

    const businessService = container.resolve(BusinessService);
    const result = await businessService.createBusiness(BUSINESS_REQUEST);
    expect(result.email).toBe(BUSINESS_REQUEST.email);
  });

  it('should create business without website', async () => {
    const BUSINESS_REQUEST: BusinessCreationDTO = {
      name: 'Test store',
      industry: 'Clothing',
      email: 'TestStore@test.com',
    };

    businessRepositoryMock.create.mockResolvedValue(Business.build(BUSINESS_REQUEST));

    const businessService = container.resolve(BusinessService);
    const result = await businessService.createBusiness(BUSINESS_REQUEST);
    expect(result.email).toBe(BUSINESS_REQUEST.email);
  });
});
