import debug from 'debug';
import { injectable } from 'tsyringe';
import { BusinessCreationDTO, BusinessUpdateDTO } from '../dto/BusinessDTO';
import { CRUD } from './CRUDInterface';
const log: debug.IDebugger = debug('app:BusinessRepository');
import { Business } from '../models/Business';

@injectable()
export default class BusinessRepository implements CRUD {
  constructor() {
    log('Created new instance of BusinessRepository');
  }

  public create = async (
    businessInfo: BusinessCreationDTO
  ): Promise<Business> => {
    try {
      const createdBusiness = Business.build(businessInfo);
      createdBusiness.save();
      log(`Added new business ${createdBusiness.name}`);
      return Promise.resolve(createdBusiness);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public delete = async (name: string): Promise<number> => {
    try {
      const deleteBusinessStatus = await Business.destroy({
        where: { name: name },
      });
      log(`Business ${name} has been deleted`);
      return Promise.resolve(deleteBusinessStatus);
    } catch (err: any) {
      log(err);
      return Promise.resolve(err);
    }
  };

  public update = async (
    name: string,
    updatedValue: BusinessUpdateDTO
  ): Promise<number> => {
    try {
      await Business.update(updatedValue, { where: { name: name } });
      log(`Business ${name} has been updated`);
      return Promise.resolve(1);
    } catch (err: any) {
      return Promise.reject(err);
    }
  };

  public get = async (name: string): Promise<Business | null> => {
    try {
      const business = await Business.findOne({ where: { name: name } });
      console.log(`Business ${business?.name} has been retrieved`);
      if (business) {
        console.log(business);
      } else {
        log('Business name not found');
      }
      return Promise.resolve(business);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public getAll = async (): Promise<Business[]> => {
    try {
      const businesses = await Business.findAll();
      console.log(businesses);
      log(`Retrieved all businesses`);
      return Promise.resolve(businesses);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };
}
