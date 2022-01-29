import debug from 'debug';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'tsyringe';
import { ProductionCreationDTO } from '../dto/Transaction/TransactionDTO';
import HttpException from '../exceptions/HttpException';
import { Production } from '../models/Production';
import ProductionRepository from '../repositories/ProductionRepository';

const log: debug.IDebugger = debug('app:ProductionService');

@injectable()
export class ProductionService {
  constructor(private productionRepository: ProductionRepository) {
    log('Created instance of ProductionService');
  }

  public getProduction = async (id: number): Promise<Production | null> => {
    return this.productionRepository.get(id);
  };

  public createProduction = async (productionCreationDTO: ProductionCreationDTO): Promise<Production> => {
    if (ProductionService.isThereNullValueProductionCreationDTO(productionCreationDTO.id)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
    }
    return this.productionRepository.create(productionCreationDTO);
  };

  public getAllProductionsForProject = async (projectId: number): Promise<Production[] | null> => {
    return this.productionRepository.getProductionByProject(projectId);
  };

  public static isThereNullValueProductionCreationDTO = (transactionId: number): boolean => {
    if (transactionId === undefined) {
      return true;
    }
    return false;
  };
}
