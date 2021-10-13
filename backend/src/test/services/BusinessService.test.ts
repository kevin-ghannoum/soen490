import { mock } from 'jest-mock-extended';
import path from 'path';
import { Sequelize } from 'sequelize-typescript';
import { container } from 'tsyringe';
import { BusinessCreationDTO } from '../../main/dto/BusinessDTO';
import { Business } from '../../main/models/Business';
import BusinessRepository from '../../main/repositories/BusinessRepository';
import { BusinessService } from '../../main/services/BusinessService';

describe('BusinessService tests', () => {
  let businessRepositoryMock: any = null;
  new Sequelize({
    validateOnly: true,
    models: [path.join(__dirname, '../../main/models', '*.ts')],
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

  it('should fail because of missing value in request data (missing line website)', async () => {
    const BUSINESS_REQUEST: any = {
      name: 'Test store',
      industry: 'Clothing',
      email: 'TestStore@test.com',
    };
    const businessService = container.resolve(BusinessService);
    await expect(businessService.createBusiness(BUSINESS_REQUEST as BusinessCreationDTO)).rejects.toThrowError(
      'Request data is missing some values'
    );
  });
});
