import debug from 'debug';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'tsyringe';
import {
  AssigneesFormat,
  ProjectCreationDTO,
  ProjectRequestDTO,
  ProjectUpdateDTO,
  ProjectUpdateRequestDTO,
} from '../dto/ProjectDTO';
import HttpException from '../exceptions/HttpException';
import { Project } from '../models/Project';
import ProjectRepository from '../repositories/ProjectRepository';
import { SaleService } from './SaleService';
import { WorksonService } from './WorksOnService';

const log: debug.IDebugger = debug('app:ProjectService');

@injectable()
export class ProjectService {
  constructor(
    private projectRepository: ProjectRepository,
    private saleService: SaleService,
    private worksOnService: WorksonService
  ) {
    log('Created instance of ProjectService');
  }

  public createProject = async (projectRequestDTO: ProjectRequestDTO): Promise<Project> => {
    const currentAndModifiedDate: Date = new Date();
    projectRequestDTO.project.createdDate = currentAndModifiedDate;
    projectRequestDTO.project.modifiedDate = currentAndModifiedDate;

    if (ProjectService.isThereNullValueProjectCreationDTO(projectRequestDTO.project)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
    }
    projectRequestDTO.sale.createdDate = currentAndModifiedDate;

    const project: Project = await this.projectRepository.create(projectRequestDTO.project);
    projectRequestDTO.sale.projectId = project.id;

    await this.saleService.createSale(projectRequestDTO.sale);
    projectRequestDTO.project.assignee.forEach(async (element: AssigneesFormat) => {
      const email: string = element.email;
      const id: number = project.id;
      await this.worksOnService.createWorksOn({ email, id });
    });
    return Promise.resolve(project);
  };

  public getProject = async (id: number): Promise<Project | null> => {
    return this.projectRepository.get(id);
  };

  public deleteProject = async (id: number): Promise<number> => {
    return this.projectRepository.delete(id);
  };

  public getProjectofBusiness = async (businessId: number): Promise<Project[] | null> => {
    return this.projectRepository.getAllofBusiness(businessId);
  };

  public getBookedProjectOfBusiness = async (businessId: number): Promise<Project[] | null> => {
    return this.projectRepository.getAllofBusiness(businessId);
  };
  public updateProject = async (projectUpdateRequestDTO: ProjectUpdateRequestDTO): Promise<number> => {
    const modifiedDate: Date = new Date();
    projectUpdateRequestDTO.project.modifiedDate = modifiedDate;

    if (ProjectService.isThereNullProjectUpdateDTO(projectUpdateRequestDTO.project)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
    }

    this.worksOnService.deleteWorksOn(projectUpdateRequestDTO.project.id);

    projectUpdateRequestDTO.project.assignee.forEach(async (element: AssigneesFormat) => {
      const email: string = element.email;
      const id: number = projectUpdateRequestDTO.project.id;
      await this.worksOnService.createWorksOn({ email, id });
    });

    const updateProject = await this.projectRepository.update(
      projectUpdateRequestDTO.project.id,
      projectUpdateRequestDTO.project
    );
    await this.saleService.updateSale(projectUpdateRequestDTO.project.id, projectUpdateRequestDTO.sale);
    return Promise.resolve(updateProject);
  };

  public static isThereNullValueProjectCreationDTO = (projectCreationDTO: ProjectCreationDTO): boolean => {
    if (
      projectCreationDTO === undefined ||
      !projectCreationDTO.title ||
      !projectCreationDTO.status ||
      !projectCreationDTO.createdDate ||
      !projectCreationDTO.deadlineDate ||
      !projectCreationDTO.modifiedDate ||
      !projectCreationDTO.email ||
      !projectCreationDTO.businessId
    ) {
      return true;
    }
    return false;
  };

  public static isThereNullProjectUpdateDTO = (projectUpdateDTO: ProjectUpdateDTO): boolean => {
    if (
      projectUpdateDTO === undefined ||
      !projectUpdateDTO.title ||
      !projectUpdateDTO.status ||
      !projectUpdateDTO.deadlineDate ||
      !projectUpdateDTO.email
    ) {
      return true;
    }
    return false;
  };
}
