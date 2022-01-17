import 'reflect-metadata';
import { mock } from 'jest-mock-extended';
import { container } from 'tsyringe';
import { CallCreationDTO, Action } from '../../main/dto/CallDTOs';
import { sequelizeMock } from '../helpers/SequelizeMock';
import CallRepository from '../../main/repositories/CallRepository';
import AccountRepository from '../../main/repositories/AccountRepository'
import { Call } from '../../main/models/Call';
import { CallService } from '../../main/services/CallService';

describe('Call test', () => {
  let callRepositoryMock: any = null;
  let accountRepositoryMock: any = null;

  beforeAll(() => {
    sequelizeMock();
  });

  beforeEach(() => {
    callRepositoryMock = mock<CallRepository>();
    accountRepositoryMock = mock<AccountRepository>();
    container.registerInstance(CallRepository, callRepositoryMock);
    container.registerInstance(AccountRepository, accountRepositoryMock);
  });

  afterEach(() => {
    container.clearInstances();
  });

  it('should create a call', async () => {
    const CALL_INFO: CallCreationDTO = {
        receiverName: "Full Name",
        date: new Date(),
        phoneNumber: "514-000-0000",
        description: "Description",
        receiverEmail: "example@gmail.com",
        action: Action.CALL_BACK,
        neverCallBack: false,
        followUp: true,
        callerEmail: "employee_example@gmail.com"
    };

    callRepositoryMock.create.mockResolvedValue(
      Call.build({
        receiverName: CALL_INFO.receiverName,
        date: CALL_INFO.date,
        phoneNumber: CALL_INFO.phoneNumber,
        description: CALL_INFO.description,
        receiverEmail: CALL_INFO.receiverEmail,
        action: CALL_INFO.action,
        neverCallBack: CALL_INFO.neverCallBack,
        followUp: CALL_INFO.followUp,
        callerEmail: CALL_INFO.callerEmail
      })
    );

    accountRepositoryMock.get.mockResolvedValue(
      {
        email: 'business333@gmail.com',
        firstName: 'Full',
        lastName: 'Name',
        phoneNumber: '514-000-0000',
        addressId: 1
      }
    );

    const callService: CallService = container.resolve(CallService);
    const result = await callService.createCall(CALL_INFO);
    expect(result.receiverName).toBe(CALL_INFO.receiverName);
    expect(result.date).toBe(CALL_INFO.date);
    expect(result.phoneNumber).toBe(CALL_INFO.phoneNumber);
    expect(result.description).toBe(CALL_INFO.description);
    expect(result.receiverEmail).toBe(CALL_INFO.receiverEmail);
    expect(result.action).toBe(CALL_INFO.action);
    expect(result.neverCallBack).toBe(CALL_INFO.neverCallBack);
    expect(result.followUp).toBe(CALL_INFO.followUp);
    expect(result.callerEmail).toBe(CALL_INFO.callerEmail);
  });


  it('should fail because of missing data (date) in request status', async () => {
    const CALL_WITH_MISSING_INFO = {
      receiverName: "Receiver Name",
      phoneNumber: "514-000-0000",
      description: "Description",
      receiverEmail: "example@gmail.com",
      action: Action.CALL_BACK,
      neverCallBack: false,
      followUp: true,
      callerEmail: "employee_example@gmail.com"
    };

    const callService: CallService = container.resolve(CallService);

    await expect(
      callService.createCall(CALL_WITH_MISSING_INFO as CallCreationDTO)
      ).rejects.toThrowError('Request data is missing some values');
  });

  it('should fail because of missing data (description) in request status', async () => {
    const CALL_WITH_MISSING_INFO = {
      receiverName: "Receiver Name",
      date: new Date(),
      phoneNumber: "514-000-0000",
      receiverEmail: "example@gmail.com",
      action: Action.CALL_BACK,
      neverCallBack: false,
      followUp: true,
      callerEmail: "employee_example@gmail.com"
    };

    const callService: CallService = container.resolve(CallService);

    await expect(
      callService.createCall(CALL_WITH_MISSING_INFO as CallCreationDTO)
      ).rejects.toThrowError('Request data is missing some values');
  });

  it('should fail because of missing data (email) in request status', async () => {
    const CALL_WITH_MISSING_INFO = {
      receiverName: "Receiver Name",
      date: new Date(),
      phoneNumber: "514-000-0000",
      description: "Description",
      action: Action.CALL_BACK,
      neverCallBack: false,
      followUp: true,
      callerEmail: "employee_example@gmail.com"
    };

    const callService: CallService = container.resolve(CallService);

    await expect(
      callService.createCall(CALL_WITH_MISSING_INFO as CallCreationDTO)
      ).rejects.toThrowError('Request data is missing some values');
  });

  it('should fail because of missing data (action) in request status', async () => {
    const CALL_WITH_MISSING_INFO = {
      receiverName: "Receiver Name",
      date: new Date(),
      phoneNumber: "514-000-0000",
      description: "Description",
      receiverEmail: "example@gmail.com",
      neverCallBack: false,
      followUp: true,
      callerEmail: "employee_example@gmail.com"
    };

    const callService: CallService = container.resolve(CallService);

    await expect(
      callService.createCall(CALL_WITH_MISSING_INFO as CallCreationDTO)
      ).rejects.toThrowError('Request data is missing some values');
  });

  it('should fail because of missing data (never call back boolean) in request status', async () => {
    const CALL_WITH_MISSING_INFO = {
      receiverName: "Receiver Name",
      date: new Date(),
      phoneNumber: "514-000-0000",
      description: "Description",
      receiverEmail: "example@gmail.com",
      action: Action.CALL_BACK,
      followUp: true,
      callerEmail: "employee_example@gmail.com"
    };

    const callService: CallService = container.resolve(CallService);

    await expect(
      callService.createCall(CALL_WITH_MISSING_INFO as CallCreationDTO)
      ).rejects.toThrowError('Request data is missing some values');
  });

  it('should fail because of missing data (follow up boolean) in request status', async () => {
    const CALL_WITH_MISSING_INFO = {
      receiverName: "Receiver Name",
      date: new Date(),
      phoneNumber: "514-000-0000",
      description: "Description",
      receiverEmail: "example@gmail.com",
      action: Action.CALL_BACK,
      neverCallBack: false,
      callerEmail: "employee_example@gmail.com"
    };

    const callService: CallService = container.resolve(CallService);

    await expect(
      callService.createCall(CALL_WITH_MISSING_INFO as CallCreationDTO)
      ).rejects.toThrowError('Request data is missing some values');
  });
  
  it('should fail because of missing data (caller email) in request status', async () => {
    const CALL_WITH_MISSING_INFO = {
      receiverName: "Receiver Name",
      date: new Date(),
      phoneNumber: "514-000-0000",
      description: "Description",
      receiverEmail: "example@gmail.com",
      action: Action.CALL_BACK,
      neverCallBack: false,
      followUp: true,
    };

    const callService: CallService = container.resolve(CallService);

    await expect(
      callService.createCall(CALL_WITH_MISSING_INFO as CallCreationDTO)
      ).rejects.toThrowError('Request data is missing some values');
  });


});
