import debug from 'debug';
import { injectable } from 'tsyringe';
import {
  TaskCreationDTO,
  TaskUpdateDTO,
} from '../dto/TaskDTOs';
import { CRUD } from './CRUDInterface';
const log: debug.IDebugger = debug('app:TaskRepository');
import { Task } from '../models/Task';

@injectable()
export default class TaskRepository implements CRUD {
  constructor() {
    log('Created new instance of TaskRepository');
  }

  public create = async (taskInfo: TaskCreationDTO): Promise<Task> => {
    try {
      const createdTask = Task.build(taskInfo);
      createdTask.save();

      log(`Added new task ${createdTask.title}`);
      return Promise.resolve(createdTask);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public delete = async (taskId: number): Promise<number> => {
    try {
      const deletedTaskStatus = await Task.destroy({
        where: {
          id: taskId,
        },
      });
      log(`Task with Id ${taskId} has been deleted`);
      return Promise.resolve(deletedTaskStatus);
    } catch (err: any) {
      log(err);
      return Promise.resolve(err);
    }
  };

  public update = async (
    taskId: number,
    updatedValue: TaskUpdateDTO
  ): Promise<number> => {
    try {
      await Task.update(updatedValue, { where: { id: taskId } });
      log(`Task with id ${taskId} has been updated`);
      return Promise.resolve(1);
    } catch (err: any) {
      return Promise.reject(err);
    }
  };

  public get = async (taskId: number): Promise<Task | null> => {
    try {
      const task = await Task.findByPk(taskId);

      log(`Task with Id ${task?.id} has been retrieved`);
      return Promise.resolve(task);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public getAll = async (): Promise<Task[]> => {
    try {
      const tasks = await Task.findAll();

      log(`Retrieved all tasks`);
      return Promise.resolve(tasks);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };
}
