import debug from 'debug';
import { injectable } from 'tsyringe';
import { InvoiceCreationDTO, InvoiceUpdateDTO } from '../dto/InvoiceDTO';
import { CRUD } from './CRUDInterface';
const log: debug.IDebugger = debug('app:InvoiceRepository');
import { Invoice } from '../models/Invoice';

@injectable()
export default class InvoiceRepository implements CRUD {
  constructor() {
    log('Created new instance of InvoiceRepository');
  }

  public create = async (invoiceInfo: InvoiceCreationDTO): Promise<Invoice> => {
    try {
      const createdInvoice = Invoice.build(invoiceInfo);
      await createdInvoice.save();

      log(`Added new invoice with id ${createdInvoice.id}`);
      return Promise.resolve(createdInvoice);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public delete = async (invoiceId: number): Promise<number> => {
    try {
      const deleteInvoiceStatus = await Invoice.destroy({
        where: { invoiceId: invoiceId },
      });

      log(`Invoice for production of id ${invoiceId} has been deleted`);
      return Promise.resolve(deleteInvoiceStatus);
    } catch (err: any) {
      log(err);
      return Promise.resolve(err);
    }
  };

  public update = async (productionId: number, updatedValue: InvoiceUpdateDTO): Promise<number> => {
    try {
      await Invoice.update(updatedValue, {
        where: { productionId: productionId },
      });

      log(`Invoice of production id ${productionId} has been updated`);
      return Promise.resolve(1);
    } catch (err: any) {
      return Promise.reject(err);
    }
  };

  public get = async (productionId: number): Promise<Invoice | null> => {
    try {
      const invoice = await Invoice.findOne({
        where: { productionId: productionId },
      });

      if (invoice) {
        log(invoice);
        log(`invoice of production with id ${invoice?.productionId} has been retrieved`);
      } else {
        log(`No invoice have been found for production with id ${productionId}`);
      }

      return Promise.resolve(invoice);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public getAll = async (): Promise<Invoice[]> => {
    try {
      const invoices = await Invoice.findAll();

      if (invoices) {
        log(invoices);
        log(`Retrieved all invoices`);
      } else {
        log(`No invoices have been retrieved`);
      }

      return Promise.resolve(invoices);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };
}
