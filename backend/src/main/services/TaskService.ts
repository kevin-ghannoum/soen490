import { injectable } from 'tsyringe';
import debug from 'debug';
import TaskRepository from '../repositories/TaskRepository';
import { TaskCreationDTO, TaskUpdateDTO } from '../dto/TaskDTOs';
import { Task } from '../models/Task';
import HttpException from '../exceptions/HttpException';
import { StatusCodes } from 'http-status-codes';
const log: debug.IDebugger = debug('app:SocialMediaPageService');

@injectable()
export class TaskService {
  constructor(private taskRepository: TaskRepository) {
    log('Created instance of TaskService');
  }

  public createTask = async (taskDTO: TaskCreationDTO): Promise<Task> => {
    if (TaskService.isThereNullValueTaskCreationDTO(taskDTO)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
    }
    return this.taskRepository.create(taskDTO);
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

  public static isThereNullValueTaskCreationDTO = (taskCreationDTO: TaskCreationDTO): boolean => {
    if (
      taskCreationDTO === undefined ||
      !taskCreationDTO.title ||
      !taskCreationDTO.status ||
      !taskCreationDTO.deadlineDate ||
      !taskCreationDTO.createdDate ||
      !taskCreationDTO.modifiedDate
    ) {
      return true;
    }
    return false;
  };
}
