import { injectable } from 'tsyringe';
import debug from 'debug';
import { CallCreationDTO, CallUpdateDTO } from '../dto/CallDTOs';
import HttpException from '../exceptions/HttpException';
import { StatusCodes } from 'http-status-codes';
import CallRepository from '../repositories/CallRepository';
import AccountRepository from '../repositories/AccountRepository';
import { Call } from '../models/Call';
const log: debug.IDebugger = debug('app:callService-example');

@injectable()
export class CallService {
  constructor(private callRepository: CallRepository, private accountRepository: AccountRepository) {
    log('Created new instance of LogCallService');
  }

  public createCall = async (callCreationDTO: CallCreationDTO): Promise<Call> => {
    if (CallService.isThereNullValueCallDTO(callCreationDTO)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
    }
    const receiver = await this.accountRepository.get(callCreationDTO.receiverEmail);
    callCreationDTO.phoneNumber = receiver?.phoneNumber;
    callCreationDTO.receiverName = receiver ? receiver.firstName + ' ' + receiver.lastName : undefined;
    return this.callRepository.create(callCreationDTO);
  };

  public getCalls = async (): Promise<Call[]> => {
    return this.callRepository.getAll();
  };

  public getCallById = async (id: number): Promise<Call | null> => {
    return this.callRepository.getById(id);
  };

  public getAllByCallerEmail = async (callerEmail: string): Promise<Call[] | null> => {
    return this.callRepository.getAllByCallerEmail(callerEmail);
  };

  public deleteCall = async (id: number): Promise<number> => {
    return this.callRepository.delete(id);
  };

  public updateCall = async (id: number, callUpdateDTO: CallUpdateDTO): Promise<number> => {
    return this.callRepository.update(id, callUpdateDTO);
  };

  public searchCallsByReceiverName = async (receiverName: string): Promise<Call[] | null> => {
    return this.callRepository.searchByReceiverName(receiverName);
  };

  public searchCallsByPhoneNumber = async (number: string): Promise<Call[] | null> => {
    return this.callRepository.searchByPhoneNumber(number);
  };

  public searchCallsByReceiverEmail = async (receiverEmail: string): Promise<Call[] | null> => {
    return this.callRepository.searchByReceiverEmail(receiverEmail);
  };

  public searchCallsByCallerEmail = async (callerEmail: string): Promise<Call[] | null> => {
    return this.callRepository.searchByCallerEmail(callerEmail);
  };

  public static isThereNullValueCallDTO = (callCreationDTO: CallCreationDTO): boolean => {
    if (
      !callCreationDTO.date ||
      !callCreationDTO.description ||
      !callCreationDTO.receiverEmail ||
      !callCreationDTO.action ||
      callCreationDTO.followUp === undefined ||
      callCreationDTO.neverCallBack === undefined ||
      !callCreationDTO.callerEmail
    ) {
      return true;
    }

    return false;
  };
}
