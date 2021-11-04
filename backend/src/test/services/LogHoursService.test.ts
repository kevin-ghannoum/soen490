import 'reflect-metadata';
import { mock } from 'jest-mock-extended';
import { container } from 'tsyringe';
import { ScheduledDay } from '../../main/dto/LogHours/EmployeeHoursInputTypeDTOs';
import { LogHoursCreationDTO } from '../../main/dto/LogHours/LogHoursDTOs';
import { PayStatus } from '../../main/dto/LogHours/PayDTOs';
import { EmployeeHoursInputType } from '../../main/models/EmployeeHoursInputType';
import { Pay } from '../../main/models/Pay';
import EmployeeHoursInputTypeRepository from '../../main/repositories/EmployeeHoursInputTypeRepository';
import PayRepository from '../../main/repositories/PayRepository';
import { LogHoursService } from '../../main/services/LogHoursService';
import { sequelizeMock } from '../helpers/SequelizeMock';
import * as schedule from 'node-schedule';

jest.mock('node-schedule');
const mockedSchedule = schedule as jest.Mocked<typeof schedule>;

describe('Log Hours test', () => {
  let payRepositoryMock: any = null;
  let employeeHoursInputTypeRepositoryMock: any = null;

  beforeAll(() => {
    sequelizeMock();
  });

  beforeEach(() => {
    payRepositoryMock = mock<PayRepository>();
    employeeHoursInputTypeRepositoryMock = mock<EmployeeHoursInputTypeRepository>();
    container.registerInstance(PayRepository, payRepositoryMock);
    container.registerInstance(EmployeeHoursInputTypeRepository, employeeHoursInputTypeRepositoryMock);
  });

  afterEach(() => {
    container.clearInstances();
  });

  it('should create a log hour', async () => {
    const logHoursInfo: LogHoursCreationDTO = {
      employeeHoursInputType: {
        email: 'employee@gmail.com',
        automatic: false,
        scheduledDay: ScheduledDay.SUNDAY,
      },
      pay: {
        issueDate: new Date(),
        hoursWorked: 40,
        status: PayStatus.NOT_PAID,
        periodStart: '2021-10-31',
        periodEnd: '2021-10-31',
        email: 'supervisor@gmail.com',
        amount: 500,
      },
    };

    employeeHoursInputTypeRepositoryMock.upsert.mockResolvedValue(
      EmployeeHoursInputType.build([
        {
          email: logHoursInfo.employeeHoursInputType.email,
          automatic: logHoursInfo.employeeHoursInputType.automatic,
          scheduledDay: logHoursInfo.employeeHoursInputType.scheduledDay,
        },
        true,
      ])
    );

    payRepositoryMock.create.mockResolvedValue(
      Pay.build({
        issueDate: logHoursInfo.pay.issueDate,
        hoursWorked: logHoursInfo.pay.hoursWorked,
        status: logHoursInfo.pay.status,
        periodStart: logHoursInfo.pay.periodStart,
        periodEnd: logHoursInfo.pay.periodEnd,
        email: logHoursInfo.pay.email,
        amount: logHoursInfo.pay.amount,
      })
    );

    const logHoursService: LogHoursService = container.resolve(LogHoursService);
    const result = await logHoursService.createLogHours(logHoursInfo);
    expect(result?.amount).toBe(500);
  });

  it('should return null when automatic set to true and day is Sunday', async () => {
    const logHoursInfo: LogHoursCreationDTO = {
      employeeHoursInputType: {
        email: 'employee@gmail.com',
        automatic: true,
        scheduledDay: ScheduledDay.SUNDAY,
      },
      pay: {
        issueDate: new Date(),
        hoursWorked: 40,
        status: PayStatus.NOT_PAID,
        periodStart: '2021-10-31',
        periodEnd: '2021-10-31',
        email: 'supervisor@gmail.com',
        amount: 500,
      },
    };

    mockedSchedule.scheduleJob.mockReturnValue(schedule.scheduledJobs['bob@gmail.com']);
    mockedSchedule.scheduleJob.mockImplementation();

    employeeHoursInputTypeRepositoryMock.upsert.mockResolvedValue(
      EmployeeHoursInputType.build([
        {
          email: logHoursInfo.employeeHoursInputType.email,
          automatic: logHoursInfo.employeeHoursInputType.automatic,
          scheduledDay: logHoursInfo.employeeHoursInputType.scheduledDay,
        },
        true,
      ])
    );

    payRepositoryMock.create.mockResolvedValue(
      Pay.build({
        issueDate: logHoursInfo.pay.issueDate,
        hoursWorked: logHoursInfo.pay.hoursWorked,
        status: logHoursInfo.pay.status,
        periodStart: logHoursInfo.pay.periodStart,
        periodEnd: logHoursInfo.pay.periodEnd,
        email: logHoursInfo.pay.email,
        amount: logHoursInfo.pay.amount,
      })
    );

    const logHoursService: LogHoursService = container.resolve(LogHoursService);
    const result = await logHoursService.createLogHours(logHoursInfo);
    expect(result).toBe(null);
  });

  it('should return null when automatic set to true and day is Monday', async () => {
    const logHoursInfo: LogHoursCreationDTO = {
      employeeHoursInputType: {
        email: 'employee@gmail.com',
        automatic: true,
        scheduledDay: ScheduledDay.MONDAY,
      },
      pay: {
        issueDate: new Date(),
        hoursWorked: 40,
        status: PayStatus.NOT_PAID,
        periodStart: '2021-10-31',
        periodEnd: '2021-10-31',
        email: 'supervisor@gmail.com',
        amount: 500,
      },
    };

    mockedSchedule.scheduleJob.mockReturnValue(schedule.scheduledJobs['bob@gmail.com']);
    mockedSchedule.scheduleJob.mockImplementation();

    employeeHoursInputTypeRepositoryMock.upsert.mockResolvedValue(
      EmployeeHoursInputType.build([
        {
          email: logHoursInfo.employeeHoursInputType.email,
          automatic: logHoursInfo.employeeHoursInputType.automatic,
          scheduledDay: logHoursInfo.employeeHoursInputType.scheduledDay,
        },
        true,
      ])
    );

    payRepositoryMock.create.mockResolvedValue(
      Pay.build({
        issueDate: logHoursInfo.pay.issueDate,
        hoursWorked: logHoursInfo.pay.hoursWorked,
        status: logHoursInfo.pay.status,
        periodStart: logHoursInfo.pay.periodStart,
        periodEnd: logHoursInfo.pay.periodEnd,
        email: logHoursInfo.pay.email,
        amount: logHoursInfo.pay.amount,
      })
    );

    const logHoursService: LogHoursService = container.resolve(LogHoursService);
    const result = await logHoursService.createLogHours(logHoursInfo);
    expect(result).toBe(null);
  });

  it('should return null when automatic set to true and day is Tuesday', async () => {
    const logHoursInfo: LogHoursCreationDTO = {
      employeeHoursInputType: {
        email: 'employee@gmail.com',
        automatic: true,
        scheduledDay: ScheduledDay.TUESDAY,
      },
      pay: {
        issueDate: new Date(),
        hoursWorked: 40,
        status: PayStatus.NOT_PAID,
        periodStart: '2021-10-31',
        periodEnd: '2021-10-31',
        email: 'supervisor@gmail.com',
        amount: 500,
      },
    };

    mockedSchedule.scheduleJob.mockReturnValue(schedule.scheduledJobs['bob@gmail.com']);
    mockedSchedule.scheduleJob.mockImplementation();

    employeeHoursInputTypeRepositoryMock.upsert.mockResolvedValue(
      EmployeeHoursInputType.build([
        {
          email: logHoursInfo.employeeHoursInputType.email,
          automatic: logHoursInfo.employeeHoursInputType.automatic,
          scheduledDay: logHoursInfo.employeeHoursInputType.scheduledDay,
        },
        true,
      ])
    );

    payRepositoryMock.create.mockResolvedValue(
      Pay.build({
        issueDate: logHoursInfo.pay.issueDate,
        hoursWorked: logHoursInfo.pay.hoursWorked,
        status: logHoursInfo.pay.status,
        periodStart: logHoursInfo.pay.periodStart,
        periodEnd: logHoursInfo.pay.periodEnd,
        email: logHoursInfo.pay.email,
        amount: logHoursInfo.pay.amount,
      })
    );

    const logHoursService: LogHoursService = container.resolve(LogHoursService);
    const result = await logHoursService.createLogHours(logHoursInfo);
    expect(result).toBe(null);
  });

  it('should return null when automatic set to true and day is Wednesday', async () => {
    const logHoursInfo: LogHoursCreationDTO = {
      employeeHoursInputType: {
        email: 'employee@gmail.com',
        automatic: true,
        scheduledDay: ScheduledDay.WEDNESDAY,
      },
      pay: {
        issueDate: new Date(),
        hoursWorked: 40,
        status: PayStatus.NOT_PAID,
        periodStart: '2021-10-31',
        periodEnd: '2021-10-31',
        email: 'supervisor@gmail.com',
        amount: 500,
      },
    };

    mockedSchedule.scheduleJob.mockReturnValue(schedule.scheduledJobs['bob@gmail.com']);
    mockedSchedule.scheduleJob.mockImplementation();

    employeeHoursInputTypeRepositoryMock.upsert.mockResolvedValue(
      EmployeeHoursInputType.build([
        {
          email: logHoursInfo.employeeHoursInputType.email,
          automatic: logHoursInfo.employeeHoursInputType.automatic,
          scheduledDay: logHoursInfo.employeeHoursInputType.scheduledDay,
        },
        true,
      ])
    );

    payRepositoryMock.create.mockResolvedValue(
      Pay.build({
        issueDate: logHoursInfo.pay.issueDate,
        hoursWorked: logHoursInfo.pay.hoursWorked,
        status: logHoursInfo.pay.status,
        periodStart: logHoursInfo.pay.periodStart,
        periodEnd: logHoursInfo.pay.periodEnd,
        email: logHoursInfo.pay.email,
        amount: logHoursInfo.pay.amount,
      })
    );

    const logHoursService: LogHoursService = container.resolve(LogHoursService);
    const result = await logHoursService.createLogHours(logHoursInfo);
    expect(result).toBe(null);
  });

  it('should return null when automatic set to true and day is Thursday', async () => {
    const logHoursInfo: LogHoursCreationDTO = {
      employeeHoursInputType: {
        email: 'employee@gmail.com',
        automatic: true,
        scheduledDay: ScheduledDay.THURSDAY,
      },
      pay: {
        issueDate: new Date(),
        hoursWorked: 40,
        status: PayStatus.NOT_PAID,
        periodStart: '2021-10-31',
        periodEnd: '2021-10-31',
        email: 'supervisor@gmail.com',
        amount: 500,
      },
    };

    mockedSchedule.scheduleJob.mockReturnValue(schedule.scheduledJobs['bob@gmail.com']);
    mockedSchedule.scheduleJob.mockImplementation();

    employeeHoursInputTypeRepositoryMock.upsert.mockResolvedValue(
      EmployeeHoursInputType.build([
        {
          email: logHoursInfo.employeeHoursInputType.email,
          automatic: logHoursInfo.employeeHoursInputType.automatic,
          scheduledDay: logHoursInfo.employeeHoursInputType.scheduledDay,
        },
        true,
      ])
    );

    payRepositoryMock.create.mockResolvedValue(
      Pay.build({
        issueDate: logHoursInfo.pay.issueDate,
        hoursWorked: logHoursInfo.pay.hoursWorked,
        status: logHoursInfo.pay.status,
        periodStart: logHoursInfo.pay.periodStart,
        periodEnd: logHoursInfo.pay.periodEnd,
        email: logHoursInfo.pay.email,
        amount: logHoursInfo.pay.amount,
      })
    );

    const logHoursService: LogHoursService = container.resolve(LogHoursService);
    const result = await logHoursService.createLogHours(logHoursInfo);
    expect(result).toBe(null);
  });

  it('should return null when automatic set to true and day is Friday', async () => {
    const logHoursInfo: LogHoursCreationDTO = {
      employeeHoursInputType: {
        email: 'employee@gmail.com',
        automatic: true,
        scheduledDay: ScheduledDay.FRIDAY,
      },
      pay: {
        issueDate: new Date(),
        hoursWorked: 40,
        status: PayStatus.NOT_PAID,
        periodStart: '2021-10-31',
        periodEnd: '2021-10-31',
        email: 'supervisor@gmail.com',
        amount: 500,
      },
    };

    mockedSchedule.scheduleJob.mockReturnValue(schedule.scheduledJobs['bob@gmail.com']);
    mockedSchedule.scheduleJob.mockImplementation();

    employeeHoursInputTypeRepositoryMock.upsert.mockResolvedValue(
      EmployeeHoursInputType.build([
        {
          email: logHoursInfo.employeeHoursInputType.email,
          automatic: logHoursInfo.employeeHoursInputType.automatic,
          scheduledDay: logHoursInfo.employeeHoursInputType.scheduledDay,
        },
        true,
      ])
    );

    payRepositoryMock.create.mockResolvedValue(
      Pay.build({
        issueDate: logHoursInfo.pay.issueDate,
        hoursWorked: logHoursInfo.pay.hoursWorked,
        status: logHoursInfo.pay.status,
        periodStart: logHoursInfo.pay.periodStart,
        periodEnd: logHoursInfo.pay.periodEnd,
        email: logHoursInfo.pay.email,
        amount: logHoursInfo.pay.amount,
      })
    );

    const logHoursService: LogHoursService = container.resolve(LogHoursService);
    const result = await logHoursService.createLogHours(logHoursInfo);
    expect(result).toBe(null);
  });

  it('should return null when automatic set to true and day is Saturday', async () => {
    const logHoursInfo: LogHoursCreationDTO = {
      employeeHoursInputType: {
        email: 'employee@gmail.com',
        automatic: true,
        scheduledDay: ScheduledDay.SATURDAY,
      },
      pay: {
        issueDate: new Date(),
        hoursWorked: 40,
        status: PayStatus.NOT_PAID,
        periodStart: '2021-10-31',
        periodEnd: '2021-10-31',
        email: 'supervisor@gmail.com',
        amount: 500,
      },
    };

    mockedSchedule.scheduleJob.mockReturnValue(schedule.scheduledJobs['bob@gmail.com']);
    mockedSchedule.scheduleJob.mockImplementation();

    employeeHoursInputTypeRepositoryMock.upsert.mockResolvedValue(
      EmployeeHoursInputType.build([
        {
          email: logHoursInfo.employeeHoursInputType.email,
          automatic: logHoursInfo.employeeHoursInputType.automatic,
          scheduledDay: logHoursInfo.employeeHoursInputType.scheduledDay,
        },
        true,
      ])
    );

    payRepositoryMock.create.mockResolvedValue(
      Pay.build({
        issueDate: logHoursInfo.pay.issueDate,
        hoursWorked: logHoursInfo.pay.hoursWorked,
        status: logHoursInfo.pay.status,
        periodStart: logHoursInfo.pay.periodStart,
        periodEnd: logHoursInfo.pay.periodEnd,
        email: logHoursInfo.pay.email,
        amount: logHoursInfo.pay.amount,
      })
    );

    const logHoursService: LogHoursService = container.resolve(LogHoursService);
    const result = await logHoursService.createLogHours(logHoursInfo);
    expect(result).toBe(null);
  });

  it('should fail because of missing value in request data (pay amount)', async () => {
    const logHoursInfo = {
      employeeHoursInputType: {
        email: 'employee@gmail.com',
        automatic: false,
        scheduledDay: ScheduledDay.SUNDAY,
      },
      pay: {
        issueDate: new Date(),
        hoursWorked: 40,
        status: PayStatus.NOT_PAID,
        periodStart: '2021-10-31',
        periodEnd: '2021-10-31',
        email: 'supervisor@gmail.com',
      },
    };

    const logHoursService: LogHoursService = container.resolve(LogHoursService);
    await expect(logHoursService.createLogHours(logHoursInfo as LogHoursCreationDTO)).rejects.toThrowError(
      'Request data is missing some values'
    );
  });
});
