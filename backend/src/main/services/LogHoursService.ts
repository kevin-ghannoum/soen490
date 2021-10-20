import { injectable } from 'tsyringe';
import debug from 'debug';
import UserRepository from '../repositories/UserRepository';
import { UserDTO } from '../dto/UserDTO';
import EmployeeHoursInputTypeRepository from '../repositories/EmployeeHoursInputTypeRepository';
import {
  EmployeeHoursInputTypeCreationDTO,
  EmployeeHoursInputTypeUpdateDTO,
} from '../dto/LogHours/EmployeeHoursInputTypeDTOs';
import { LogHoursCreationDTO } from '../dto/LogHours/LogHoursDTOs';
import { PayCreationDTO, PayUpdateDTO } from '../dto/LogHours/PayDTOs';
import HttpException from '../exceptions/HttpException';
import { StatusCodes } from 'http-status-codes';
import PayRepository from '../repositories/PayRepository';
import { Pay } from '../models/Pay';
import { EmployeeHoursInputType } from '../models/EmployeeHoursInputType';
const log: debug.IDebugger = debug('app:userService-example');

@injectable()
export class LogHoursService {
  private employeeHoursInputTypeRepository: EmployeeHoursInputTypeRepository;
  private payRepository: PayRepository;

  constructor(employeeHoursInputTypeRepository: EmployeeHoursInputTypeRepository, payRepository: PayRepository) {
    log('Created new instance of LogHoursService');
    this.employeeHoursInputTypeRepository = employeeHoursInputTypeRepository;
    this.payRepository = payRepository;
  }

  public createLogHours = async (logHoursCreationDTO: LogHoursCreationDTO): Promise<Pay | null> => {
    if (LogHoursService.isThereNullValueLogHoursDTO(logHoursCreationDTO)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
    }

    if (this.getEmployeeHoursInputType(logHoursCreationDTO.employeeHoursInputType.email) === null) {
      await this.employeeHoursInputTypeRepository.create(logHoursCreationDTO.employeeHoursInputType);
    }
    else {
      await this.updateEmployeeHoursInputType(logHoursCreationDTO.employeeHoursInputType.email, logHoursCreationDTO.employeeHoursInputType);
    }

    if (logHoursCreationDTO.employeeHoursInputType.automatic) {
      // schedule pay creation
    } else {
      return await this.payRepository.create(logHoursCreationDTO.pay);
    }

    return null;
  };

  public getPaysByEmail = async (email: string): Promise<Pay[] | null> => {
    return await this.payRepository.getAllByEmail(email);
  };

  public getEmployeeHoursInputType = async (email: string): Promise<EmployeeHoursInputType | null> => {
    return await this.employeeHoursInputTypeRepository.get(email);
  };

  public updatePay = async (id: number, payUpdateDTO: PayUpdateDTO): Promise<Number> => {
    return await this.payRepository.update(id, payUpdateDTO);
  };

  public updateEmployeeHoursInputType = async (
    email: string,
    employeeHoursInputTypeUpdateDTO: EmployeeHoursInputTypeUpdateDTO
  ): Promise<number> => {
    return await this.employeeHoursInputTypeRepository.update(email, employeeHoursInputTypeUpdateDTO);
  };

  public deleteEmployeeHoursInputType = async (email: string): Promise<number> => {
    return await this.employeeHoursInputTypeRepository.delete(email);
  };

  public static isThereNullValueLogHoursDTO = (logHoursCreationDTO: LogHoursCreationDTO): boolean => {
    if (
      logHoursCreationDTO.employeeHoursInputType === undefined ||
      logHoursCreationDTO.pay === undefined ||
      !logHoursCreationDTO.employeeHoursInputType.email ||
      !logHoursCreationDTO.pay.email ||
      !logHoursCreationDTO.pay.hoursWorked ||
      !logHoursCreationDTO.pay.periodStart ||
      !logHoursCreationDTO.pay.periodEnd ||
      (logHoursCreationDTO.employeeHoursInputType.automatic && !logHoursCreationDTO.employeeHoursInputType.scheduledDay)
    ) {
      return true;
    }

    return false;
  };
}
