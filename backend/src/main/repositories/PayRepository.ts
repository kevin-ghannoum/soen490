import debug from 'debug';
import { injectable } from 'tsyringe';
import { PayCreationDTO, PayUpdateDTO } from '../dto/LogHours/PayDTOs';
import { Pay } from '../models/Pay';
import { CRUD } from './CRUDInterface';
const log: debug.IDebugger = debug('app:PayRepository');

@injectable()
export default class PayRepository implements CRUD {
  constructor() {
    log('Created new instance of PayRepository');
  }

  public create = async (payInfo: PayCreationDTO): Promise<Pay> => {
    try {
      const createdPay = Pay.build(payInfo);
      await createdPay.save();
      log(`Pay id ${createdPay.id} created`);

      return Promise.resolve(createdPay);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public get = async (id: number): Promise<Pay | null> => {
    try {
      const pay = await Pay.findByPk(id);

      if (pay) {
        log(`Pay id ${pay.id} found`);
      } else {
        log(`No pay with id ${id} found`);
      }

      return Promise.resolve(pay);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public delete = async (id: number): Promise<number> => {
    try {
      const deletedPayStatus = await Pay.destroy({
        where: {
          id: id,
        },
      });

      log(`Deleted pay with id ${id}`);
      return Promise.resolve(deletedPayStatus);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public update = async (id: number, updatedValue: PayUpdateDTO): Promise<number> => {
    try {
      await Pay.update(updatedValue, {
        where: {
          id: id,
        },
      });

      log(`Updated pay with id: ${id}`);
      return Promise.resolve(1);
    } catch (err: any) {
      return Promise.reject(err);
    }
  };

  public getAll = async (): Promise<Pay[]> => {
    try {
      const pays = await Pay.findAll();

      log(`Retrieved all pays`);
      return Promise.resolve(pays);
    } catch (err: any) {
      return Promise.reject(err);
    }
  };

  public getAllByEmail = async (email: string): Promise<Pay[]> => {
    try {
      const pays = await Pay.findAll({ where: { email: email } });

      log(`Retrieved all pays belonging to ${email}`);
      return Promise.resolve(pays);
    } catch (err: any) {
      return Promise.reject(err);
    }
  };

  public getLastByEmail = async (email: string): Promise<Pay | null> => {
    try {
      const pay = await Pay.findOne({ where: { email: email }, order: [ [ 'issueDate', 'DESC']] });

      log(`Rretrieved most recent pay belonging to ${email}`);
      return Promise.resolve(pay);
    } catch (err: any) {
      return Promise.reject(err);
    }
  };
}
