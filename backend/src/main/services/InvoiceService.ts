import debug from 'debug';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'tsyringe';
import { InvoiceCreationDTO, InvoiceUpdateDTO } from '../dto/InvoiceDTO';
import HttpException from '../exceptions/HttpException';
import { Invoice } from '../models/Invoice';
import InvoiceRepository from '../repositories/InvoiceRepository';

const log: debug.IDebugger = debug('app:InvoiceService');

@injectable()
export class InvoiceService {
  constructor(private invoiceRepository: InvoiceRepository) {
    log('Created instance of InvoiceService');
  }

  public createInvoice = async (invoiceCreationDTO: InvoiceCreationDTO): Promise<Invoice> => {
    if (InvoiceService.isThereNullValueInvoiceCreationDTO(invoiceCreationDTO)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
    }
    return this.invoiceRepository.create(invoiceCreationDTO);
  };

  public updateInvoice = async (id: number, invoiceUpdateDTO: InvoiceUpdateDTO): Promise<number> => {
    if (!invoiceUpdateDTO.totalAmount) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
    }
    return this.invoiceRepository.update(id, invoiceUpdateDTO);
  };

  public static isThereNullValueInvoiceCreationDTO = (invoiceCreationDTO: InvoiceCreationDTO): boolean => {
    if (
      invoiceCreationDTO === undefined ||
      !invoiceCreationDTO.date ||
      !invoiceCreationDTO.description ||
      !invoiceCreationDTO.productionId ||
      !invoiceCreationDTO.quantity ||
      !invoiceCreationDTO.totalAmount
    ) {
      return true;
    }
    return false;
  };
}
