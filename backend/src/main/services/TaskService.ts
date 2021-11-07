import { injectable } from 'tsyringe';
import debug from 'debug';
import TaskRepository from '../repositories/TaskRepository';
import { TaskCreationDTO, TaskUpdateDTO } from '../dto/TaskDTOs';
import { Task } from '../models/Task';
const log: debug.IDebugger = debug('app:SocialMediaPageService');

@injectable()
export class TaskService {
  constructor(private taskRepository: TaskRepository) {
    log('Created instance of TaskService');
  }

  public createTask = async (taskDTO: TaskCreationDTO): Promise<Task> => {
    return await this.taskRepository.create(taskDTO);
  };

  public getTask = async (taskId: string): Promise<Task | null> => {
    return this.taskRepository.get(parseInt(taskId, 10));
  };

  public getAllTask = async (): Promise<Task[] | null> => {
    return this.taskRepository.getAll();
  };

  public deleteTask = async (taskId: string): Promise<number> => {
    return this.taskRepository.delete(parseInt(taskId, 10));
  };

  public updateTask = async (taskId: string, taskUpdateDTO: TaskUpdateDTO): Promise<number> => {
    return this.taskRepository.update(parseInt(taskId, 10), taskUpdateDTO);
  };
}
