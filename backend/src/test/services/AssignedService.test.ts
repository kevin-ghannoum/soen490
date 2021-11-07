import 'reflect-metadata';
import { mock } from 'jest-mock-extended';
import { sequelizeMock } from '../helpers/SequelizeMock';
import AssignedRepository from '../../main/repositories/AssignedRepository';
import { container } from 'tsyringe';
import { MultipleAssignedCreationDTO } from '../../main/dto/AssignedDTOs';
import { Assigned } from '../../main/models/Assigned';
import { AssignedService } from '../../main/services/AssignedService';

describe('AssignedService tests', () => {
  let assignedRepositoryMock: any = null;
  
  beforeAll(() => {
    sequelizeMock();
  });

  beforeEach(() => {
    assignedRepositoryMock = mock<AssignedRepository>();
    container.registerInstance(AssignedRepository, assignedRepositoryMock);
  });

  afterEach(() => {
    container.clearInstances();
  });

  it('should delete all tasks with a task id', async () => {
    const NEW_ASSIGNED: MultipleAssignedCreationDTO = {
      taskId: 1,
      emails: ['test1@email.com', 'test2@email.com', 'test3@email.com', 'test4@email.com']
    };
    assignedRepositoryMock.deleteById.mockResolvedValue(4);
    const assignedService = container.resolve(AssignedService);
    await assignedService.createMultipleAssignment(NEW_ASSIGNED);
    const result = await assignedService.deleteAllByTaskId('1');
    expect(result).toBe(4);
  });

  it('should create multiple assigneds from one task id and return the list of assigned', async () => {
    const NEW_ASSIGNED: MultipleAssignedCreationDTO = {
      taskId: 1,
      emails: ['test1@email.com', 'test2@email.com', 'test3@email.com', 'test4@email.com']
    };
    assignedRepositoryMock.create
      .mockReturnValueOnce(Assigned.build({ taskId: NEW_ASSIGNED.taskId, email: NEW_ASSIGNED.emails[0] }))
      .mockReturnValueOnce(Assigned.build({ taskId: NEW_ASSIGNED.taskId, email: NEW_ASSIGNED.emails[1] }))
      .mockReturnValueOnce(Assigned.build({ taskId: NEW_ASSIGNED.taskId, email: NEW_ASSIGNED.emails[2] }))
      .mockReturnValueOnce(Assigned.build({ taskId: NEW_ASSIGNED.taskId, email: NEW_ASSIGNED.emails[3] }));
    const assignedService = container.resolve(AssignedService);
    const result = await assignedService.createMultipleAssignment(NEW_ASSIGNED);
    expect(result[0].taskId).toBe(NEW_ASSIGNED.taskId);
    expect(result[0].email).toBe(NEW_ASSIGNED.emails[0]);
    expect(result[1].email).toBe(NEW_ASSIGNED.emails[1]);
    expect(result[2].email).toBe(NEW_ASSIGNED.emails[2]);
    expect(result[3].email).toBe(NEW_ASSIGNED.emails[3]);
  });

  it('should fail because of missing value in request data (missing taskId)', async () => {
    const NEW_ASSIGNED = {
      emails: ['test2@email.com', 'test3@email.com', 'test4@email.com']
    };
    const assignedService = container.resolve(AssignedService);
    await expect(
      assignedService.createMultipleAssignment(NEW_ASSIGNED as MultipleAssignedCreationDTO)
    ).rejects.toThrowError('Request data is missing some values');
  });

  it('should fail because of missing value in request data (missing emails)', async () => {
    const NEW_ASSIGNED = {
      taskId: 1,
    };
    const assignedService = container.resolve(AssignedService);
    await expect(
      assignedService.createMultipleAssignment(NEW_ASSIGNED as MultipleAssignedCreationDTO)
    ).rejects.toThrowError('Request data is missing some values');
  });
});
