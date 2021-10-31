import debug from 'debug';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'tsyringe';
import { SaleCreationDTO, SaleUpdateDTO } from '../dto/SaleDTO';
import HttpException from '../exceptions/HttpException';
import { Sale } from '../models/Sale';
import SaleRepository from '../repositories/SaleRepository';

const log: debug.IDebugger = debug('app:SaleService');

@injectable()
export class SaleService {
  constructor(private saleRepository: SaleRepository) {
    log('Created instance of SaleService');
  }

  public createSale = async (saleRequestDTO: SaleCreationDTO) => {
    if (SaleService.isThereNullValueSaleRequestDTO(saleRequestDTO)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
    }
    return this.saleRepository.create(saleRequestDTO);
  };

  public getSale = async (id: number): Promise<Sale | null> => {
    return this.saleRepository.get(id);
  };

  public updateSale = async (id: number, saleUpdateDTO: SaleUpdateDTO) => {
    return this.saleRepository.update(id, saleUpdateDTO);
  };

  public deleteSale = async (id: number): Promise<number> => {
    return this.saleRepository.delete(id);
  };

  public static isThereNullValueSaleRequestDTO = (saleRequestDTO: SaleCreationDTO): boolean => {
    if (
      saleRequestDTO === undefined ||
      !saleRequestDTO.amount ||
      !saleRequestDTO.createdDate ||
      !saleRequestDTO.dueDate ||
      !saleRequestDTO.description ||
      !saleRequestDTO.projectId
    ) {
      return true;
    }
    return false;
  };
}
