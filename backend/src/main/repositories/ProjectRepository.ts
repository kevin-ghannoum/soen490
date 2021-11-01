import debug from 'debug';
import { injectable } from 'tsyringe';
import { ProjectCreationDTO, ProjectUpdateDTO } from '../dto/ProjectDTO';
import { CRUD } from './CRUDInterface';
const log: debug.IDebugger = debug('app:ProjectRepository');
import { Project } from '../models/Project';
import { Sale } from '../models/Sale';

@injectable()
export default class ProjectRepository implements CRUD {
  constructor() {
    log('Created new instance of ProjectRepository');
  }

  public create = async (projectInfo: ProjectCreationDTO): Promise<Project> => {
    try {
      const createdProject = Project.build(projectInfo);
      await createdProject.save();
      log(`Added new project ${createdProject.title}`);

      return Promise.resolve(createdProject);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public delete = async (id: number): Promise<number> => {
    try {
      const deleteProjectStatus = await Project.destroy({
        where: { id: id },
      });
      log(`Project ${id} has been deleted`);

      return Promise.resolve(deleteProjectStatus);
    } catch (err: any) {
      log(err);
      return Promise.resolve(err);
    }
  };

  public update = async (id: number, updatedValue: ProjectUpdateDTO): Promise<number> => {
    try {
      await Project.update(updatedValue, { where: { id: id } });
      log(`Project ${id} has been updated`);

      return Promise.resolve(1);
    } catch (err: any) {
      return Promise.reject(err);
    }
  };

  public get = async (id: number): Promise<Project | null> => {
    try {
      const project = await Project.findByPk(id, { include: [Sale] });
      if (project) {
        log(`Project ${project?.title} has been retrieved`);
      } else {
        log('Project name not found');
      }

      return Promise.resolve(project);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public getAllofBusiness = async (businessId: number): Promise<Project[]> => {
    try {
      const projects = await Project.findAll({
        where: {
          businessId: businessId,
        },
        include: [Sale],
      });
      log(projects);
      log(`Retrieved all projects`);

      return Promise.resolve(projects);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public getAll = async (): Promise<Project[]> => {
    try {
      const projects = await Project.findAll();
      log(projects);
      log(`Retrieved all projects`);

      return Promise.resolve(projects);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };
}
