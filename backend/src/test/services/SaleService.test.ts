import 'reflect-metadata';
import { mock } from 'jest-mock-extended';
import { container } from 'tsyringe';
import { SaleCreationDTO } from '../../main/dto/SaleDTO';
import { Sale } from '../../main/models/Sale';
import SaleRepository from '../../main/repositories/SaleRepository';
import { SaleService } from '../../main/services/SaleService';
import { sequelizeMock } from '../helpers/SequelizeMock';

describe('SaleService tests', () => {
  let saleRepositoryMock: any = null;
  const date = new Date();

  beforeAll(() => {
    sequelizeMock();
  });

  beforeEach(() => {
    saleRepositoryMock = mock<SaleRepository>();
    container.registerInstance(SaleRepository, saleRepositoryMock);
  });

  afterEach(() => {
    container.clearInstances();
  });

  it('should create a sale', async () => {
    const SALE_INFO: SaleCreationDTO = {
      amount: 2,
      createdDate: date,
      dueDate: date,
      description: 'description',
      projectId: 1,
    };

    saleRepositoryMock.create.mockResolvedValue(Sale.build(SALE_INFO));
    const saleService = container.resolve(SaleService);
    const result = await saleService.createSale(SALE_INFO);
    expect(result.amount).toBe(SALE_INFO.amount);
    expect(result.createdDate).toBe(SALE_INFO.createdDate);
    expect(result.dueDate).toBe(SALE_INFO.dueDate);
    expect(result.description).toBe(SALE_INFO.description);
    expect(result.projectId).toBe(SALE_INFO.projectId);
  });

  it('should fail because of missing value in request data (missing amount)', async () => {
    const SALE_INFO = {
      createdDate: date,
      dueDate: date,
      description: 'description',
      projectId: 1,
    };
    const saleService = container.resolve(SaleService);
    await expect(saleService.createSale(SALE_INFO as SaleCreationDTO)).rejects.toThrowError(
      'Request data is missing some values'
    );
  });

  it('should fail because of missing value in request data (missing dueDate)', async () => {
    const SALE_INFO = {
      amount: 2,
      createdDate: date,
      description: 'description',
      projectId: 1,
    };
    const saleService = container.resolve(SaleService);
    await expect(saleService.createSale(SALE_INFO as SaleCreationDTO)).rejects.toThrowError(
      'Request data is missing some values'
    );
  });

  it('should fail because of missing value in request data (missing createdDate)', async () => {
    const SALE_INFO = {
      amount: 2,
      dueDate: date,
      description: 'description',
      projectId: 1,
    };
    const saleService = container.resolve(SaleService);
    await expect(saleService.createSale(SALE_INFO as SaleCreationDTO)).rejects.toThrowError(
      'Request data is missing some values'
    );
  });

  it('should fail because of missing value in request data (missing description)', async () => {
    const SALE_INFO = {
      amount: 2,
      dueDate: date,
      createdDate: date,
      projectId: 1,
    };
    const saleService = container.resolve(SaleService);
    await expect(saleService.createSale(SALE_INFO as SaleCreationDTO)).rejects.toThrowError(
      'Request data is missing some values'
    );
  });

  it('should fail because of missing value in request data (missing projectId)', async () => {
    const SALE_INFO = {
      amount: 2,
      dueDate: date,
      createdDate: date,
      description: 'description',
    };
    const saleService = container.resolve(SaleService);
    await expect(saleService.createSale(SALE_INFO as SaleCreationDTO)).rejects.toThrowError(
      'Request data is missing some values'
    );
  });
});
