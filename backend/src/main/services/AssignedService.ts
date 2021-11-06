import { injectable } from 'tsyringe';
import debug from 'debug';
import AssignedRepository from '../repositories/AssignedRepository';
import { AssignedCreationDTO, MultipleAssignedCreationDTO } from '../dto/AssignedDTOs';
import { Assigned } from '../models/Assigned';

const log: debug.IDebugger = debug('app:SocialMediaPageService');

@injectable()
export class AssignedService {
  constructor(private assignedRepository: AssignedRepository) {
    log('Created instance of AssignedService');
  }

  public createMultipleAssignment = async (assignedCreationDTO: MultipleAssignedCreationDTO): Promise<Assigned[]> => {
    const response: Assigned[] = [];
    assignedCreationDTO.emails.forEach(async (email: string) => {
      const assignDTO: AssignedCreationDTO = { taskId: assignedCreationDTO.taskId, email: email };
      response.push(await this.assignedRepository.create(assignDTO));
    });
    return response;
  };

  public getAssignedsByTaskId = async (taskId: string): Promise<Assigned[] | null> => {
    return this.assignedRepository.getByTaskId(parseInt(taskId, 10));
  };

  public updateAssignments = async (
    taskId: string,
    assignedToUpdateDTO: MultipleAssignedCreationDTO
  ): Promise<number> => {
      const intTaskId: number = parseInt(taskId, 10);
    const existingAssignments = await this.assignedRepository.getByTaskId(parseInt(taskId, 10));
    const emailList: string[] = [];
    const newEmailList: string[] = assignedToUpdateDTO.emails;
    existingAssignments?.forEach((ass: Assigned) => {
      emailList.push(ass.email);
    });
    const emailsToRemove = emailList.filter(function (em) {
      return !newEmailList.includes(em);
    });
    const emailsToAdd = newEmailList.filter(function (em) {
      return !emailList.includes(em);
    });
    emailsToRemove.forEach((em) =>{
        this.assignedRepository.delete({taskId: intTaskId, email: em});
    });
    emailsToAdd.forEach((em) =>{
        this.assignedRepository.create({taskId: intTaskId, email: em});
    });
    return emailsToRemove.concat(emailsToAdd).length;
  };
}
