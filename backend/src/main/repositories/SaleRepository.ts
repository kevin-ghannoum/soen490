import debug from 'debug';
import { injectable } from 'tsyringe';
import { SaleCreationDTO, SaleUpdateDTO } from '../dto/SaleDTO';
import { CRUD } from './CRUDInterface';
const log: debug.IDebugger = debug('app:SaleRepository');
import { Sale } from '../models/Sale';

@injectable()
export default class SaleRepository implements CRUD {
  constructor() {
    log('Created new instance of SaleRepository');
  }

  public create = async (saleInfo: SaleCreationDTO): Promise<Sale> => {
    try {
      const createdSale = Sale.build(saleInfo);
      createdSale.save();
      log(`Added new sale with id ${createdSale.id}`);
      return Promise.resolve(createdSale);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public delete = async (projectId: number): Promise<number> => {
    try {
      const deleteSaleStatus = await Sale.destroy({
        where: { projectId: projectId },
      });
      log(`Sale linked to project ${projectId} has been deleted`);
      return Promise.resolve(deleteSaleStatus);
    } catch (err: any) {
      log(err);
      return Promise.resolve(err);
    }
  };

  public update = async (
    projectId: number,
    updatedValue: SaleUpdateDTO
  ): Promise<number> => {
    try {
      await Sale.update(updatedValue, { where: { projectId: projectId } });
      log(`Sale for project ${projectId} has been updated`);
      return Promise.resolve(1);
    } catch (err: any) {
      return Promise.reject(err);
    }
  };

  public get = async (projectId: number): Promise<Sale | null> => {
    try {
      const sale = await Sale.findOne({ where: { projectId: projectId } });
      console.log(`Sale of project ${sale?.projectId} has been retrieved`);
      if (sale) {
        console.log(sale);
      } else {
        log('Sale not found');
      }
      return Promise.resolve(sale);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public getAll = async (): Promise<Sale[]> => {
    try {
      const sales = await Sale.findAll();
      if (sales) {
        console.log(sales);
      } else {
        log('Sales not found');
      }
      log(`Retrieved all sales`);
      return Promise.resolve(sales);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };
}
