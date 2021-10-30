import { injectable } from 'tsyringe';
import debug from 'debug';
import EmployeeHoursInputTypeRepository from '../repositories/EmployeeHoursInputTypeRepository';
import {
  EmployeeHoursInputTypeCreationDTO,
  EmployeeHoursInputTypeUpdateDTO,
  ScheduledDay,
} from '../dto/LogHours/EmployeeHoursInputTypeDTOs';
import { LogHoursCreationDTO } from '../dto/LogHours/LogHoursDTOs';
import { PayCreationDTO, PayUpdateDTO } from '../dto/LogHours/PayDTOs';
import HttpException from '../exceptions/HttpException';
import { StatusCodes } from 'http-status-codes';
import PayRepository from '../repositories/PayRepository';
import { Pay } from '../models/Pay';
import { EmployeeHoursInputType } from '../models/EmployeeHoursInputType';
import * as schedule from 'node-schedule';
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

    const inputTypeInserted = await this.employeeHoursInputTypeRepository.upsert(
      logHoursCreationDTO.employeeHoursInputType
    );

    // delete scheduled job if exists
    const job = schedule.scheduledJobs[logHoursCreationDTO.pay.email];
    if (!!job) {
      job.cancel();
    }

    if (inputTypeInserted[0].automatic) {
      const scheduledDay = logHoursCreationDTO.employeeHoursInputType.scheduledDay;
      const prevMonday = new Date();
      const prevFriday = new Date();
      // get last monday and last friday
      if (scheduledDay === ScheduledDay.SATURDAY || scheduledDay === ScheduledDay.SUNDAY) {
        prevMonday.setDate(prevMonday.getDate() - ((prevMonday.getDay() + 6) % 7));
        prevFriday.setDate(prevFriday.getDate() - ((prevFriday.getDay() + 2) % 7));
      }
      // get last last monday and last friday
      else {
        prevMonday.setDate(prevMonday.getDate() - (((prevMonday.getDay() + 6) % 7) + 7));
        prevFriday.setDate(prevFriday.getDate() - (prevFriday.getDay() + 2));
      }
      logHoursCreationDTO.pay.periodStart = prevMonday.toLocaleDateString();
      logHoursCreationDTO.pay.periodEnd = prevFriday.toLocaleDateString();
      const weekdayNumber = LogHoursService.getWeekdayNumber(scheduledDay!);
      // create scheduled job
      const job = schedule.scheduleJob(logHoursCreationDTO.pay.email, {dayOfWeek: weekdayNumber}, () =>
        this.createPay(logHoursCreationDTO.pay)
      );
      return null;
    } else {
      // create pay
      return await this.payRepository.create(logHoursCreationDTO.pay);
    }
  };

  public createPay = async (payCreationDTO: PayCreationDTO): Promise<Pay> => {
    return await this.payRepository.create(payCreationDTO);
  };

  public getPaysByEmail = async (email: string): Promise<Pay[] | null> => {
    return await this.payRepository.getAllByEmail(email);
  };

  public getLatestPay = async (email: string): Promise<Pay | null> => {
    return await this.payRepository.getLatestByEmail(email);
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
      !logHoursCreationDTO.pay.status ||
      !logHoursCreationDTO.pay.email ||
      !logHoursCreationDTO.pay.hoursWorked ||
      !logHoursCreationDTO.pay.amount ||
      (logHoursCreationDTO.employeeHoursInputType.automatic &&
        !logHoursCreationDTO.employeeHoursInputType.scheduledDay) ||
      (!logHoursCreationDTO.employeeHoursInputType.automatic && !logHoursCreationDTO.pay.periodStart) ||
      (!logHoursCreationDTO.employeeHoursInputType.automatic && !logHoursCreationDTO.pay.periodEnd)
    ) {
      return true;
    }

    return false;
  };

  public static getWeekdayNumber = (scheduledDay: ScheduledDay): number => {
    var weekdayNumber = 0;
    switch (scheduledDay) {
      case ScheduledDay.SUNDAY:
        weekdayNumber = 0;
        break;
      case ScheduledDay.MONDAY:
        weekdayNumber = 1;
        break;
      case ScheduledDay.TUESDAY:
        weekdayNumber = 2;
        break;
      case ScheduledDay.WEDNESDAY:
        weekdayNumber = 3;
        break;
      case ScheduledDay.THURSDAY:
        weekdayNumber = 4;
        break;
      case ScheduledDay.FRIDAY:
        weekdayNumber = 5;
        break;
      case ScheduledDay.SATURDAY:
        weekdayNumber = 6;
        break;
    }
    return weekdayNumber;
  };
}
