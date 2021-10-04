import debug from 'debug';
import { injectable } from 'tsyringe';
import { GoalCreationDTO, GoalUpdateDTO } from '../dto/GoalDTO';
import { CRUD } from './CRUDInterface';
const log: debug.IDebugger = debug('app:GoalRepository');
import { Goal } from '../models/Goal';

@injectable()
export default class GoalRepository implements CRUD {
  constructor() {
    log('Created new instance of Goal');
  }
  
  public create = async (goalInfo: GoalCreationDTO): Promise<Goal> => {
    try {
      const createdGoal = Goal.build(goalInfo);
      createdGoal.save();
      log(`Added new business ${createdGoal.title}`);
      return Promise.resolve(createdGoal);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public delete = async (title: string): Promise<number> => {
    try {
      const deleteGoalStatus = await Goal.destroy({
        where: { title: title },
      });
      log(`Goal ${title} has been deleted`);
      return Promise.resolve(deleteGoalStatus);
    } catch (err: any) {
      log(err);
      return Promise.resolve(err);
    }
  };

  public update = async (
    title: string,
    updatedValue: GoalUpdateDTO
  ): Promise<number> => {
    try {
      await Goal.update(updatedValue, { where: { title: title } });
      log(`Goal ${title} has been updated`);
      return Promise.resolve(1);
    } catch (err: any) {
      return Promise.reject(err);
    }
  };

  public get = async (title: string): Promise<Goal | null> => {
    try {
      const goal = await Goal.findOne({ where: { title: title } });
      console.log(`Business ${goal?.title} has been retrieved`);
      if (goal) {
        console.log(goal);
      } else {
        log('Goal not found');
      }
      return Promise.resolve(goal);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public getAll = async (): Promise<Goal[]> => {
    try {
      const goals = await Goal.findAll();
      if (goals) {
        console.log(goals);
      } else {
        log('Goal not found');
      }
      log(`Retrieved all goals`);
      return Promise.resolve(goals);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };
}
