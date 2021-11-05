import debug from 'debug';
import { injectable } from 'tsyringe';
import { ProductionCreationDTO, ProductionUpdateDTO } from '../dto/Transaction/TransactionDTO';
import { CRUD } from './CRUDInterface';
const log: debug.IDebugger = debug('app:ProductionRepository');
import { Transaction } from '../models/Transaction';
import { Production } from '../models/Production';

@injectable()
export default class ProductionRepository implements CRUD {
  constructor() {
    log('Created new instance of ProductionRepository');
  }

  public create = async (transactionInfo: ProductionCreationDTO): Promise<Production> => {
    try {
      const createdProduciton = Production.build(transactionInfo, {
        include: [Transaction],
      });
      await createdProduciton.save();

      log(`added new production ${createdProduciton.id}`);
      return Promise.resolve(createdProduciton);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public get = async (id: number): Promise<Production | null> => {
    try {
      const production = await Production.findByPk(id, {
        include: [Transaction],
      });

      if (production) {
        log(production);
        log(`Production with id ${production?.id} has been retrieved`);
      } else {
        log(`No production have been found with id ${id}`);
      }

      return Promise.resolve(production);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public delete = async (id: number): Promise<number> => {
    try {
      const deletedProductionStatus = await Transaction.destroy({
        where: { id: id },
      });

      log(`Production with id ${id} has been deleted`);
      return Promise.resolve(deletedProductionStatus);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public update = async (id: number, updatedProductionValue: ProductionUpdateDTO): Promise<number> => {
    try {
      if (updatedProductionValue.transaction) {
        Transaction.update(updatedProductionValue.transaction, {
          where: { id: id },
        });
      }
      delete updatedProductionValue.transaction;
      await Production.update(updatedProductionValue, {
        where: { id: id },
      });

      log(`Produciton with id ${id} has been updated`);
      return Promise.resolve(1);
    } catch (err: any) {
      return Promise.reject(err);
    }
  };

  public getAll = async (): Promise<Production[]> => {
    try {
      const productions = await Production.findAll({
        include: [Transaction],
      });

      log(productions);
      log(`retrieved all productions`);
      return Promise.resolve(productions);
    } catch (err: any) {
      return Promise.reject(err);
    }
  };
}
