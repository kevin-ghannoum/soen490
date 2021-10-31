import { mock } from 'jest-mock-extended';
import path from 'path';
import 'reflect-metadata';
import { Sequelize } from 'sequelize-typescript';
import { container } from 'tsyringe';
import { ScheduledDay } from '../../main/dto/LogHours/EmployeeHoursInputTypeDTOs';
import { LogHoursCreationDTO } from '../../main/dto/LogHours/LogHoursDTOs';
import { PayStatus } from '../../main/dto/LogHours/PayDTOs';
import { EmployeeHoursInputType } from '../../main/models/EmployeeHoursInputType';
import { Pay } from '../../main/models/Pay';
import EmployeeHoursInputTypeRepository from '../../main/repositories/EmployeeHoursInputTypeRepository';
import PayRepository from '../../main/repositories/PayRepository';
import { LogHoursService } from '../../main/services/LogHoursService';

describe('Log Hours test', () => {
  let payRepositoryMock: any = null;
  let employeeHoursInputTypeRepositoryMock: any = null;

  new Sequelize({
    validateOnly: true,
    models: [path.join(__dirname, '../../main/models', '*.ts')],
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

  it('should create an employee account', async () => {
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
