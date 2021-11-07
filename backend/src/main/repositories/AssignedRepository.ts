import debug from 'debug';
import { injectable } from 'tsyringe';
import { AssignedCreationDTO, AssignedUpdateDTO } from '../dto/AssignedDTOs';
import { CRUD } from './CRUDInterface';
const log: debug.IDebugger = debug('app:AssignedRepository');
import { Assigned } from '../models/Assigned';

@injectable()
export default class AssignedRepository implements CRUD {
  constructor() {
    log('Created new instance of AssignedRepository');
  }

  public create = async (assignedInfo: AssignedCreationDTO): Promise<Assigned> => {
    try {
      const createdAssigned = Assigned.build(assignedInfo);
      await createdAssigned.save();

      log(`Added new assignment taskId: ${createdAssigned.id} and email: ${createdAssigned.email}`);
      return Promise.resolve(createdAssigned);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public delete = async (assign: { taskId: number; email: string }): Promise<number> => {
    try {
      const deletedAssignedStatus = await Assigned.destroy({
        where: {
          taskId: assign.taskId,
          email: assign.email,
        },
      });

      log(`Invite with id ${assign.taskId} and email ${assign.email} has been deleted`);
      return Promise.resolve(deletedAssignedStatus);
    } catch (err: any) {
      log(err);
      return Promise.resolve(err);
    }
  };

  public update = async (
    assign: { taskId: number; email: string },
    updatedValue: AssignedUpdateDTO
  ): Promise<number> => {
    try {
      await Assigned.update(updatedValue, {
        where: {
          taskId: assign.taskId,
          email: assign.email,
        },
      });

      log(`Assignment with taskId: ${assign.taskId} and email: ${assign.email} has been updated`);
      return Promise.resolve(1);
    } catch (err: any) {
      return Promise.reject(err);
    }
  };

  public get = async (assign: { taskId: number; email: string }): Promise<Assigned | null> => {
    try {
      const assigned = await Assigned.findOne({
        where: {
          taskId: assign.taskId,
          email: assign.email,
        },
      });
      if (assigned) {
        log(`Assignment with taskId ${assigned?.taskId} and email ${assigned?.email} has been retrieved`);
      } else {
        log(`Assignment with taskId ${assign.taskId} and email ${assign.email} not found`);
      }

      return Promise.resolve(assigned);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public getByEmail = async (email: string): Promise<Assigned[] | null> => {
    try {
      const assigned: Assigned[] = await Assigned.findAll({
        where: {
          email: email,
        },
      });

      if (assigned) {
        log(`Assignments with email ${email} have been retrieved`);
      } else {
        log(`Assignment with email ${email} not found`);
      }
      return Promise.resolve(assigned);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public getByTaskId = async (taskId: number): Promise<Assigned[] | null> => {
    try {
      const assigned: Assigned[] = await Assigned.findAll({
        where: {
          taskId: taskId,
        },
      });

      if (assigned) {
        log(`Assignments with taskId ${taskId} have been retrieved`);
      } else {
        log(`Assignment with taskId ${taskId} not found`);
      }
      return Promise.resolve(assigned);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public getAll = async (): Promise<Assigned[]> => {
    try {
      const invites = await Assigned.findAll();

      log(`Retrieved all assignments`);
      return Promise.resolve(invites);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };
  public deleteById = async (taskId: number): Promise<number> => {
    try {
      const numberOfRows = await Assigned.destroy({
        where: {
          taskId: taskId,
        },
      });
      log(`ALL invites with id ${taskId} have been deleted`);
      return Promise.resolve(numberOfRows);
    } catch (err: any) {
      log(err);
      return Promise.resolve(err);
    }
  };
}
