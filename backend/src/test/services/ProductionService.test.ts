import 'reflect-metadata';
import { mock } from 'jest-mock-extended';
import { container } from 'tsyringe';
import { sequelizeMock } from '../helpers/SequelizeMock';
import { ProductionCreationDTO } from '../../main/dto/Transaction/TransactionDTO';
import { Expense } from '../../main/models/Expense';
import ProductionRepository from '../../main/repositories/ProductionRepository';
import { ProductionService } from '../../main/services/ProductionService';

describe('ProductionService tests', () => {
  let productionServiceMock: any = null;

  beforeAll(() => {
    sequelizeMock();
  });

  beforeEach(() => {
    productionServiceMock = mock<ProductionRepository>();
    container.registerInstance(ProductionRepository, productionServiceMock);
  });

  afterEach(() => {
    container.clearInstances();
  });

  const PRODUCTION_REQUEST_INFO: ProductionCreationDTO = {
    id: 1,
  };

  it('should create a production', async () => {
    productionServiceMock.create.mockResolvedValue(Expense.build(PRODUCTION_REQUEST_INFO));

    const productionService = container.resolve(ProductionService);
    const result = await productionService.createProduction(PRODUCTION_REQUEST_INFO);
    expect(result.id).toBe(PRODUCTION_REQUEST_INFO.id);
  });

  it('Create production should fail because of missing value in request data', async () => {
    const PRODUCTION_MISSING = {};
    const productionService = container.resolve(ProductionService);
    await expect(
      productionService.createProduction(PRODUCTION_MISSING as unknown as ProductionCreationDTO)
    ).rejects.toThrowError('Request data is missing some values');
  });
});
