import debug from 'debug';
import { injectable } from 'tsyringe';
import { CallCreationDTO, CallUpdateDTO } from '../dto/CallDTOs';
import { CRUD } from './CRUDInterface';
const log: debug.IDebugger = debug('app:CallRepository');
import { Call } from '../models/Call';
import { Account } from '../models/Account';
import { Op } from 'sequelize';

@injectable()
export default class CallRepository implements CRUD {
  constructor() {
    log('Created new instance of CallRepository');
  }

  public create = async (callInfo: CallCreationDTO): Promise<Call> => {
    try {
      const createdCall = Call.build(callInfo);
      await createdCall.save();

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

  public update = async (id: number, updatedValue: CallUpdateDTO): Promise<number> => {
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

  public get = async (specificCall: { id: number; callerEmail: string }): Promise<Call | null> => {
    // Will probably not be used often.
    try {
      const call = await Call.findOne({
        where: {
          id: specificCall.id,
          callerEmail: specificCall.callerEmail,
        },
        include: [Account],
      });

      log(`Call with id ${call?.id} and email ${call?.callerEmail} has been retrieved`);
      return Promise.resolve(call);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public getByCallerEmail = async (callerEmail: string): Promise<Call | null> => {
    try {
      const call = await Call.findOne({
        where: {
          callerEmail: callerEmail,
        },
      });

      if (call) {
        log(`Call email ${call?.callerEmail} has been retrieved`);
      } else {
        log(`Call with email ${callerEmail} not found`);
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
        log(`Call with id ${call?.id} has been retrieved`);
      } else {
        log(`Call with email ${id} not found`);
      }

      return Promise.resolve(call);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public getAllByCallerEmail = async (callerEmail: string): Promise<Call[] | null> => {
    try {
      const call: Call[] = await Call.findAll({
        where: {
          callerEmail: callerEmail,
        },
      });

      log(`Calls related to caller email ${callerEmail} have been retrieved`);
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

  public searchByReceiverName = async (receiverName: string): Promise<Call[]> => {
    try {
      const operatorsAliases = {
        like: Op.like,
      };
      const calls = await Call.findAll({
        limit: 20,
        where: {
          receiverName: {
            [operatorsAliases.like]: `%${receiverName}%`,
          },
        },
      });

      log(`Retrieved all calls with receiver name containing ${receiverName}`);
      return Promise.resolve(calls);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public searchByPhoneNumber = async (number: string): Promise<Call[]> => {
    try {
      const operatorsAliases = {
        like: Op.like,
      };
      const calls = await Call.findAll({
        limit: 20,
        where: {
          phoneNumber: {
            [operatorsAliases.like]: `%${number}%`,
          },
        },
      });
      log(`Retrieved all calls with phone number containing ${number}`);
      return Promise.resolve(calls);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public searchByReceiverEmail = async (receiverEmail: string): Promise<Call[]> => {
    try {
      const operatorsAliases = {
        like: Op.like,
      };
      const calls = await Call.findAll({
        limit: 20,
        where: {
          receiverEmail: {
            [operatorsAliases.like]: `%${receiverEmail}%`,
          },
        },
      });
      log(`Retrieved all calls with email containing ${receiverEmail}`);
      return Promise.resolve(calls);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public searchByCallerEmail = async (callerEmail: string): Promise<Call[]> => {
    try {
      const operatorsAliases = {
        like: Op.like,
      };
      const calls = await Call.findAll({
        limit: 20,
        where: {
          callerEmail: {
            [operatorsAliases.like]: `%${callerEmail}%`,
          },
        },
      });
      log(`Retrieved all calls with email containing ${callerEmail}`);
      return Promise.resolve(calls);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };
}
