import debug from 'debug';
import { injectable } from 'tsyringe';
import { WorksOnCreationDTO } from '../dto/WorksOnDTO';
import { EmployeeAccount } from '../models/EmployeeAccount';
const log: debug.IDebugger = debug('app:WorksOnRepository');
import { WorksOn } from '../models/WorksOn';
import { RelationCRUD } from './CRUDInterface';

@injectable()
export default class WorksOnRepository implements RelationCRUD {
  constructor() {
    log('Created new instance of WorksOnRepository');
  }

  public create = async (worksOnInfo: WorksOnCreationDTO): Promise<WorksOn> => {
    try {
      const createdWorksOn = WorksOn.build(worksOnInfo);
      await createdWorksOn.save();
      log(`Added new workOn ${createdWorksOn.id} and ${createdWorksOn.email}`);

      return Promise.resolve(createdWorksOn);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public delete = async (id: number): Promise<number> => {
    try {
      const deleteWorksOn = await WorksOn.destroy({
        where: { id: id },
      });
      log(`WorksOn for ${id} has been deleted`);

      return Promise.resolve(deleteWorksOn);
    } catch (err: any) {
      log(err);
      return Promise.resolve(err);
    }
  };

  public get = async (id: number): Promise<WorksOn[]> => {
    try {
      const worksOn = await WorksOn.findAll({
        where: {
          id: id,
        },
        include: [{ model: EmployeeAccount }],
      });

      log(worksOn);
      log(`Retrieved all projects`);

      return Promise.resolve(worksOn);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };
}
