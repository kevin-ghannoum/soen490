import debug from 'debug';
import { injectable } from 'tsyringe';
import { CallCreationDTO, CallUpdateDTO } from '../dto/CallDTOs';
import { CRUD } from './CRUDInterface';
const log: debug.IDebugger = debug('app:CallRepository');
import { Call } from '../models/Call';
import { Account } from '../models/Account';

@injectable()
export default class CallRepository implements CRUD {
  constructor() {
    log('Created new instance of CallRepository');
  }

  public create = async (callInfo: CallCreationDTO): Promise<Call> => {
    try {
      const createdCall = Call.build(callInfo);
      createdCall.save();

      log(`Added new call id ${createdCall.id}`);
      return Promise.resolve(createdCall);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public delete = async (id: number): Promise<number> => {
    try {
      const deletedCallStatus = await Call.destroy({
        where: {
          id: id,
        },
      });

      log(`Call with id ${id} has been deleted`);
      return Promise.resolve(deletedCallStatus);
    } catch (err: any) {
      log(err);
      return Promise.resolve(err);
    }
  };

  public update = async (
    id: number,
    updatedValue: CallUpdateDTO
  ): Promise<number> => {
    try {
      await Call.update(updatedValue, {
        where: {
          id: id,
        },
      });

      log(`Call with id ${id} has been updated`);
      return Promise.resolve(1);
    } catch (err: any) {
      return Promise.reject(err);
    }
  };

  public get = async (specificCall: {
    id: number;
    email: string;
  }): Promise<Call | null> => {
    try {
      const call = await Call.findOne({
        where: {
          id: specificCall.id,
          email: specificCall.email,
        },
        include: [Account],
      });

      log(
        `Call with id ${call?.id} and email ${call?.email} has been retrieved`
      );
      return Promise.resolve(call);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public getByEmail = async (email: string): Promise<Call | null> => {
    try {
      const call = await Call.findOne({
        where: {
          email: email,
        },
      });

      if (call) {
        log(
          `Call with id ${call?.id} and email ${call?.email} has been retrieved`
        );
      } else {
        log(`Call with email ${email} not found`);
      }

      return Promise.resolve(call);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public getById = async (id: number): Promise<Call | null> => {
    try {
      const call = await Call.findOne({
        where: {
          id: id,
        },
      });

      if (call) {
        log(
          `Call with id ${call?.id} and email ${call?.email} has been retrieved`
        );
      }else{
        log(`Call with email ${id} not found`);
      }

      return Promise.resolve(call);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public getAllByEmail = async (email: string): Promise<Call[] | null> => {
    try {
      const call: Call[] = await Call.findAll({
        where: {
          email: email,
        },
      });

      log(`Calls have been retrieved`);
      return Promise.resolve(call);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public getAll = async (): Promise<Call[]> => {
    try {
      const calls = await Call.findAll();

      log(`Retrieved all calls`);
      return Promise.resolve(calls);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };
}
