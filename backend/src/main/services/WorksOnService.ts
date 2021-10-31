import debug from 'debug';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'tsyringe';
import { WorksOnCreationDTO } from '../dto/WorksOnDTO';
import HttpException from '../exceptions/HttpException';
import { WorksOn } from '../models/WorksOn';
import WorksOnRepository from '../repositories/WorksOnRepository';

const log: debug.IDebugger = debug('app:WorkOnService');

@injectable()
export class WorksonService {
  constructor(private worksOnRepository: WorksOnRepository) {
    log('Created instance of WorksOnService');
  }

  public createWorksOn = async (worksOnCreationDTO: WorksOnCreationDTO) => {
    if (WorksonService.isThereNullValueWorksOnDTO(worksOnCreationDTO)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
    }
    return this.worksOnRepository.create(worksOnCreationDTO);
  };

  public deleteWorksOn = async (id: number): Promise<number> => {
    return this.worksOnRepository.delete(id);
  };

  public getWorksOn = async (id: number): Promise<WorksOn[] | null> => { 
    return this.worksOnRepository.get(id)
  }

  public static isThereNullValueWorksOnDTO = (worksOnCreationDTO: WorksOnCreationDTO): boolean => {
    if (
      worksOnCreationDTO === undefined ||
      !worksOnCreationDTO.id ||
      !worksOnCreationDTO.email
    ) {
      return true;
    }
    return false;
  };
}
