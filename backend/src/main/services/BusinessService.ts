import debug from 'debug';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'tsyringe';
import { BusinessCreationDTO, BusinessUpdateDTO } from '../dto/BusinessDTO';
import HttpException from '../exceptions/HttpException';
import { Business } from '../models/Business';
import BusinessRepository from '../repositories/BusinessRepository';

const log: debug.IDebugger = debug('app:BusinessService');

@injectable()
export class BusinessService {
  constructor(
    private businessRepository: BusinessRepository
  ) {
    log('Created instance of BusinessService');
  }

  public createBusiness = async (businessRequestDTO: BusinessCreationDTO): Promise<Business> => {
    if (BusinessService.isThereNullValueBusinessCreationDTO(businessRequestDTO)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
    }
    return this.businessRepository.create(businessRequestDTO);
  };

  public getBusiness = async (id: number): Promise<Business | null> => {
    return this.businessRepository.get(id);
  };

  public getBusinesses = async (): Promise<Business[]> => {
    return this.businessRepository.getAll();
  };

  public updateBusiness = async (id: number, businessUpdateDTO:BusinessUpdateDTO): Promise<Number> => {
    return this.businessRepository.update(id, businessUpdateDTO);
  };

  public deleteBusiness = async (id: number): Promise<number> => {
    return this.businessRepository.delete(id);
  };

  public static isThereNullValueBusinessCreationDTO = (businessRequestDTO: BusinessCreationDTO): boolean => {
    if (
      businessRequestDTO === undefined ||
      !businessRequestDTO.email ||
      !businessRequestDTO.industry ||
      !businessRequestDTO.name
    ) {
      return true;
    }
    return false;
  };
}
