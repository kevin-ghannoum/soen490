import 'reflect-metadata';
import { mock } from 'jest-mock-extended';
import { container } from 'tsyringe';
import { Task } from '../../main/models/Task';
import { TaskService } from '../../main/services/TaskService';
import { sequelizeMock } from '../helpers/SequelizeMock';
import TaskRepository from '../../main/repositories/TaskRepository';
import { TaskCreationDTO, TaskStatus, TaskUpdateDTO } from '../../main/dto/TaskDTOs';

describe('TaskService tests', () => {
  let taskRepositoryMock: any = null;
  const date = new Date();

  beforeAll(() => {
    sequelizeMock();
  });

  beforeEach(() => {
    taskRepositoryMock = mock<TaskRepository>();
    container.registerInstance(TaskRepository, taskRepositoryMock);
  });

  afterEach(() => {
    container.clearInstances();
  });

  it('should create a new task and return said task', async () => {
    const NEW_TASK: TaskCreationDTO = {
      title: 'title',
      description: 'desc',
      status: TaskStatus.NEW,
      deadlineDate: date,
      createdDate: date,
      modifiedDate: date,
      projectId: 1,
    };
    taskRepositoryMock.create.mockResolvedValue(
      Task.build({
        title: NEW_TASK.title,
        description: NEW_TASK.description,
        status: NEW_TASK.status,
        deadlineDate: NEW_TASK.deadlineDate,
        createdDate: NEW_TASK.createdDate,
        modifiedDate: NEW_TASK.modifiedDate,
        projectId: NEW_TASK.projectId,
      })
    );
    const taskService = container.resolve(TaskService);
    const result = await taskService.createTask(NEW_TASK);
    expect(result.title).toBe(NEW_TASK.title);
    expect(result.description).toBe(NEW_TASK.description);
    expect(result.status).toBe(NEW_TASK.status);
    expect(result.deadlineDate).toBe(NEW_TASK.deadlineDate);
    expect(result.createdDate).toBe(NEW_TASK.createdDate);
    expect(result.modifiedDate).toBe(NEW_TASK.modifiedDate);
    expect(result.projectId).toBe(NEW_TASK.projectId);
  });

  it('should fail because of missing value in request data (missing title)', async () => {
    const NEW_TASK = {
      description: 'desc',
      status: TaskStatus.NEW,
      deadlineDate: date,
      createdDate: date,
      modifiedDate: date,
      projectId: 1,
    };
    const taskService = container.resolve(TaskService);
    await expect(taskService.createTask(NEW_TASK as TaskCreationDTO)).rejects.toThrowError(
      'Request data is missing some values'
    );
  });

  it('should fail because of missing value in request data (missing status)', async () => {
    const NEW_TASK = {
      title: 'title',
      description: 'desc',
      deadlineDate: date,
      createdDate: date,
      modifiedDate: date,
      projectId: 1,
    };
    const taskService = container.resolve(TaskService);
    await expect(taskService.createTask(NEW_TASK as TaskCreationDTO)).rejects.toThrowError(
      'Request data is missing some values'
    );
  });

  it('should fail because of missing value in request data (missing deadlineDate)', async () => {
    const NEW_TASK = {
      title: 'title',
      description: 'desc',
      status: TaskStatus.NEW,
      createdDate: date,
      modifiedDate: date,
      projectId: 1,
    };
    const taskService = container.resolve(TaskService);
    await expect(taskService.createTask(NEW_TASK as TaskCreationDTO)).rejects.toThrowError(
      'Request data is missing some values'
    );
  });

  it('should fail because of missing value in request data (missing createdDate)', async () => {
    const NEW_TASK = {
      title: 'title',
      description: 'desc',
      status: TaskStatus.NEW,
      deadlineDate: date,
      modifiedDate: date,
      projectId: 1,
    };
    const taskService = container.resolve(TaskService);
    await expect(taskService.createTask(NEW_TASK as TaskCreationDTO)).rejects.toThrowError(
      'Request data is missing some values'
    );
  });

  it('should fail because of missing value in request data (missing modifiedDate)', async () => {
    const NEW_TASK = {
      title: 'title',
      description: 'desc',
      status: TaskStatus.NEW,
      deadlineDate: date,
      createdDate: date,
      projectId: 1,
    };
    const taskService = container.resolve(TaskService);
    await expect(taskService.createTask(NEW_TASK as TaskCreationDTO)).rejects.toThrowError(
      'Request data is missing some values'
    );
  });

  it('should update a task from its id', async () => {
    const NEW_TASK: TaskCreationDTO = {
      title: 'title',
      description: 'desc',
      status: TaskStatus.NEW,
      deadlineDate: date,
      createdDate: date,
      modifiedDate: date,
      projectId: 1,
    };
    taskRepositoryMock.create.mockResolvedValue(
      Task.build({
        id: 1,
        title: NEW_TASK.title,
        description: NEW_TASK.description,
        status: NEW_TASK.status,
        deadlineDate: NEW_TASK.deadlineDate,
        createdDate: NEW_TASK.createdDate,
        modifiedDate: NEW_TASK.modifiedDate,
        projectId: NEW_TASK.projectId,
      })
    );
    const NEWER_TASK: TaskUpdateDTO = {
      title: 'NEW title',
      description: 'changed DESCRIPTION',
      status: TaskStatus.REMOVED,
    };
    taskRepositoryMock.update.mockResolvedValue(1);
    const taskService = container.resolve(TaskService);
    const finalResult = await taskService.updateTask('1', NEWER_TASK);
    expect(finalResult).toBe(1);
  });
});
