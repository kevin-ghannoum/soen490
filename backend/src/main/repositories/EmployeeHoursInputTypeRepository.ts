import debug from 'debug';
import { injectable } from 'tsyringe';
import { CRUD } from './CRUDInterface';
const log: debug.IDebugger = debug('app:FeedbackRepository');
import {
  EmployeeHoursInputTypeCreationDTO,
  EmployeeHoursInputTypeUpdateDTO,
} from '../dto/LogHours/EmployeeHoursInputTypeDTOs';
import { EmployeeHoursInputType } from '../models/EmployeeHoursInputType';

@injectable()
export default class EmployeeHoursInputTypeRepository implements CRUD {
  constructor() {
    log('Created new instance of EmployeeHoursInputTypeRepository');
  }

  public create = async (
    employeeHoursInputTypeCreationInfo: EmployeeHoursInputTypeCreationDTO
  ): Promise<EmployeeHoursInputType> => {
    try {
      const createdEmployeeHoursInputType = EmployeeHoursInputType.build(employeeHoursInputTypeCreationInfo);
      await createdEmployeeHoursInputType.save();

      log(
        `Added new employee hours input type automatic ${createdEmployeeHoursInputType.automatic} for ${createdEmployeeHoursInputType.email}`
      );
      return Promise.resolve(createdEmployeeHoursInputType);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public upsert = async (
    employeeHoursInputTypeCreationInfo: EmployeeHoursInputTypeCreationDTO
  ): Promise<[EmployeeHoursInputType, boolean | null]> => {
    try {
      const createdEmployeeHoursInputType = EmployeeHoursInputType.upsert(employeeHoursInputTypeCreationInfo);

      log(
        `Added or updated employee hours input type automatic ${employeeHoursInputTypeCreationInfo.automatic} for ${employeeHoursInputTypeCreationInfo.email}`
      );
      return Promise.resolve(createdEmployeeHoursInputType);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public delete = async (email: string): Promise<number> => {
    try {
      const deletedEmployeeHoursInputTypeStatus = await EmployeeHoursInputType.destroy({
        where: {
          id: email,
        },
      });
      log(`Employee hours input type with email ${email} has been deleted`);
      return Promise.resolve(deletedEmployeeHoursInputTypeStatus);
    } catch (err: any) {
      log(err);
      return Promise.resolve(err);
    }
  };

  public update = async (email: string, updatedValue: EmployeeHoursInputTypeUpdateDTO): Promise<number> => {
    try {
      await EmployeeHoursInputType.update(updatedValue, { where: { email: email } });
      log(`Employee hours input type with email ${email} has been updated`);
      return Promise.resolve(1);
    } catch (err: any) {
      return Promise.reject(err);
    }
  };

  public get = async (email: string): Promise<EmployeeHoursInputType | null> => {
    try {
      const employeeHoursInputType = await EmployeeHoursInputType.findByPk(email);

      log(`Employee hours input type with email ${employeeHoursInputType?.email} has been retrieved`);
      return Promise.resolve(employeeHoursInputType);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public getAll = async (): Promise<EmployeeHoursInputType[]> => {
    try {
      const employeeHoursInputTypes = await EmployeeHoursInputType.findAll();

      log(`Retrieved all employee hours input type`);
      return Promise.resolve(employeeHoursInputTypes);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };
}
