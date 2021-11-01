import { mock } from 'jest-mock-extended';
import path from 'path';
import { Sequelize } from 'sequelize-typescript';
import { container } from 'tsyringe';
import { ProjectRequestDTO, Status, AssigneesFormat } from '../../main/dto/ProjectDTO';
import { Project } from '../../main/models/Project';
import { WorksOn } from '../../main/models/WorksOn';
import ProjectRepository from '../../main/repositories/ProjectRepository';
import { ProjectService } from '../../main/services/ProjectService';
import { SaleService } from '../../main/services/SaleService';
import { WorksonService } from '../../main/services/WorksOnService';

describe('ProjectService tests', () => {
  let projectRepositoryMock: any = null;
  let saleServiceMock: any = null;
  let worksOnServiceMock: any = null;
  const date = new Date();

  new Sequelize({
    validateOnly: true,
    models: [path.join(__dirname, '../../main/models', '*.ts')],
  });

  beforeEach(() => {
    projectRepositoryMock = mock<ProjectRepository>();
    saleServiceMock = mock<SaleService>();
    worksOnServiceMock = mock<WorksonService>();
    container.registerInstance(ProjectRepository, projectRepositoryMock);
    container.registerInstance(SaleService, saleServiceMock);
    container.registerInstance(WorksonService, worksOnServiceMock);
  });

  afterEach(() => {
    container.clearInstances();
  });

  it('should create a project', async () => {
    const PROJECT_INFO: ProjectRequestDTO = {
      project: {
        title: 'title',
        description: 'description',
        status: Status.PENDING,
        serviceType: 'service',
        leadSource: 'source',
        leadCredit: 'credit',
        leadRanking: 'ranking',
        createdDate: date,
        deadlineDate: date,
        followUpDate: date,
        modifiedDate: date,
        extraNotes: 'notes',
        email: 'test@test.com',
        businessId: 1,
        assignee: [{ label: 'user@user.com' }, { label: 'test@test.com' }],
      },
      sale: {
        amount: 1,
        createdDate: date,
        dueDate: date,
        description: 's',
        projectId: 1,
      },
    };

    projectRepositoryMock.create.mockResolvedValue(Project.build(PROJECT_INFO.project));
    saleServiceMock.create.mockResolvedValue(Project.build(PROJECT_INFO.sale));

    PROJECT_INFO.project.assignee.forEach((element: AssigneesFormat) => {
      worksOnServiceMock.create.mockResolvedValue(WorksOn.build({ id: 1, email: element.label }));
    });

    const projectService = container.resolve(ProjectService);
    const result = await projectService.createProject(PROJECT_INFO);
    expect(result.title).toBe(PROJECT_INFO.project.title);
    expect(result.email).toBe(PROJECT_INFO.project.email);
  });

  it('should fail because of missing value in request data (missing title)', async () => {
    const PROJECT_INFO = {
      project: {
        description: 'description',
        status: Status.PENDING,
        serviceType: 'service',
        leadSource: 'source',
        leadCredit: 'credit',
        leadRanking: 'ranking',
        createdDate: date,
        deadlineDate: date,
        followUpDate: date,
        modifiedDate: date,
        extraNotes: 'notes',
        email: 'test@test.com',
        businessId: 1,
        assignee: [{ label: 'user@user.com' }, { label: 'test@test.com' }],
      },
      sale: {
        amount: 1,
        createdDate: date,
        dueDate: date,
        description: 's',
        projectId: 1,
      },
    };
    const projectService = container.resolve(ProjectService);
    await expect(projectService.createProject(PROJECT_INFO as ProjectRequestDTO)).rejects.toThrowError(
      'Request data is missing some values'
    );
  });

  it('should fail because of missing value in request data (missing status)', async () => {
    const PROJECT_INFO = {
      project: {
        title: 'title',
        description: 'description',
        serviceType: 'service',
        leadSource: 'source',
        leadCredit: 'credit',
        leadRanking: 'ranking',
        createdDate: date,
        deadlineDate: date,
        followUpDate: date,
        modifiedDate: date,
        extraNotes: 'notes',
        email: 'test@test.com',
        businessId: 1,
        assignee: [{ label: 'user@user.com' }, { label: 'test@test.com' }],
      },
      sale: {
        amount: 1,
        createdDate: date,
        dueDate: date,
        description: 's',
        projectId: 1,
      },
    };
    const projectService = container.resolve(ProjectService);
    await expect(projectService.createProject(PROJECT_INFO as ProjectRequestDTO)).rejects.toThrowError(
      'Request data is missing some values'
    );
  });

  it('should fail because of missing value in request data (missing email)', async () => {
    const PROJECT_INFO = {
      project: {
        title: 'title',
        description: 'description',
        status: Status.PENDING,
        serviceType: 'service',
        leadSource: 'source',
        leadCredit: 'credit',
        leadRanking: 'ranking',
        createdDate: date,
        deadlineDate: date,
        followUpDate: date,
        modifiedDate: date,
        extraNotes: 'notes',
        businessId: 1,
        assignee: [{ label: 'user@user.com' }, { label: 'test@test.com' }],
      },
      sale: {
        amount: 1,
        createdDate: date,
        dueDate: date,
        description: 's',
        projectId: 1,
      },
    };
    const projectService = container.resolve(ProjectService);
    await expect(projectService.createProject(PROJECT_INFO as ProjectRequestDTO)).rejects.toThrowError(
      'Request data is missing some values'
    );
  });

  it('should fail because of missing value in request data (missing businessId)', async () => {
    const PROJECT_INFO = {
      project: {
        title: 'title',
        description: 'description',
        status: Status.PENDING,
        serviceType: 'service',
        leadSource: 'source',
        leadCredit: 'credit',
        leadRanking: 'ranking',
        createdDate: date,
        deadlineDate: date,
        followUpDate: date,
        modifiedDate: date,
        extraNotes: 'notes',
        email: 'Test@test.com',
        assignee: [{ label: 'user@user.com' }, { label: 'test@test.com' }],
      },
      sale: {
        amount: 1,
        createdDate: date,
        dueDate: date,
        description: 's',
        projectId: 1,
      },
    };
    const projectService = container.resolve(ProjectService);
    await expect(projectService.createProject(PROJECT_INFO as ProjectRequestDTO)).rejects.toThrowError(
      'Request data is missing some values'
    );
  });
});
