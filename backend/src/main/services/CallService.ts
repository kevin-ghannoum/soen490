import { injectable } from 'tsyringe';
import debug from 'debug';
import { CallCreationDTO, CallUpdateDTO } from '../dto/CallDTOs';
import HttpException from '../exceptions/HttpException';
import { StatusCodes } from 'http-status-codes';
import CallRepository from '../repositories/CallRepository';
import { Call } from '../models/Call';
import ClientAccountRepository from '../repositories/ClientAccountRepository';
const log: debug.IDebugger = debug('app:userService-example');

@injectable()
export class CallService {
  constructor(
    private callRepository: CallRepository, private clientAccountRepository: ClientAccountRepository
  ) {
    log('Created new instance of LogCallService');
  }

  public createCall = async (callCreationDTO: CallCreationDTO): Promise<Call> => {
    if (CallService.isThereNullValueCallDTO(callCreationDTO)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
    }
    const client = await this.clientAccountRepository.get(callCreationDTO.email)
    callCreationDTO.phoneNumber = client?.account.phoneNumber
    callCreationDTO.receiverName = client?.account.firstName
    return this.callRepository.create(callCreationDTO);
  };

  public getCalls = async (): Promise<Call[]> => {
    return this.callRepository.getAll();
  };

  public getCallById = async (id: number): Promise<Call | null> => {
    return this.callRepository.getById(id);
  };

  public getCallByEmail = async (email: string): Promise<Call | null> => {
    return this.callRepository.getByEmail(email);
  };

  public getCallsByEmail = async (email: string): Promise<Call[] | null> => {
    return this.callRepository.getAllByEmail(email)
  }

  public deleteCall =  async (id: number): Promise<number> => {
    return this.callRepository.delete(id);
  };

  public updateCall = async (id: number, callUpdateDTO: CallUpdateDTO): Promise<number> => {
    return this.callRepository.update(id, callUpdateDTO);
  };
  
  public searchCallsByName = async (name:string) : Promise<Call[] | null> => {
    return this.callRepository.searchCallsByName(name);
  };

  public searchCallsByPhoneNumber = async (number:string) : Promise<Call[] | null> => {
    return this.callRepository.searchCallsByPhoneNumber(number);
  };

  public searchCallsByEmail = async (email:string) : Promise<Call[] | null> => {
    return this.callRepository.searchCallsByEmail(email);
  };

  public searchCallsByEmployeeEmail = async (email:string) : Promise<Call[] | null> => {
    return this.callRepository.searchCallsByEmployeeEmail(email);
  };

  public static isThereNullValueCallDTO = (CallCreationDTO: CallCreationDTO): boolean => {
    if (
      !CallCreationDTO.date || 
      !CallCreationDTO.description ||
      !CallCreationDTO.email ||
      !CallCreationDTO.action ||
      CallCreationDTO.followUp === undefined ||
      CallCreationDTO.neverCallBack === undefined ||
      !CallCreationDTO.employeeEmail
    ) {
      return true;
    }
    
    return false;
  };
}
