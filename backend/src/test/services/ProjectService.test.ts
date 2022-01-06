import 'reflect-metadata';
import { mock } from 'jest-mock-extended';
import { container } from 'tsyringe';
import { ProjectRequestDTO, Status, AssigneesFormat } from '../../main/dto/ProjectDTO';
import { Project } from '../../main/models/Project';
import { WorksOn } from '../../main/models/WorksOn';
import ProjectRepository from '../../main/repositories/ProjectRepository';
import { ProjectService } from '../../main/services/ProjectService';
import { SaleService } from '../../main/services/SaleService';
import { WorksonService } from '../../main/services/WorksOnService';
import { sequelizeMock } from '../helpers/SequelizeMock';

describe('ProjectService tests', () => {
  let projectRepositoryMock: any = null;
  let saleServiceMock: any = null;
  let worksOnServiceMock: any = null;
  const date = new Date();

  beforeAll(() => {
    sequelizeMock();
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
        assignee: [{ email: 'user@user.com' }, { email: 'test@test.com' }],
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
      worksOnServiceMock.create.mockResolvedValue(WorksOn.build({ id: 1, email: element.email }));
    });

    const projectService = container.resolve(ProjectService);
    const result = await projectService.createProject(PROJECT_INFO);
    expect(result.title).toBe(PROJECT_INFO.project.title);
    expect(result.email).toBe(PROJECT_INFO.project.email);
  });

  const SALE = {
    sale: {
      amount: 1,
      createdDate: date,
      dueDate: date,
      description: 's',
      projectId: 1,
    },
  };

  const PROJECT_COMMON_DATA_FOR_TESTS = {
    project: {
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
      assignee: [{ label: 'user@user.com' }, { label: 'test@test.com' }],
    },
  };

  it('should fail because of missing value in request data (missing title)', async () => {
    const PROJECT_INFO = {
      project: {
        status: Status.PENDING,
        email: 'test@test.com',
        businessId: 1,
        ...PROJECT_COMMON_DATA_FOR_TESTS,
      },
      ...SALE,
    };
    const projectService = container.resolve(ProjectService);
    await expect(projectService.createProject(PROJECT_INFO as unknown as ProjectRequestDTO)).rejects.toThrowError(
      'Request data is missing some values'
    );
  });

  it('should fail because of missing value in request data (missing status)', async () => {
    const PROJECT_INFO = {
      project: {
        title: 'title',
        email: 'test@test.com',
        businessId: 1,
        ...PROJECT_COMMON_DATA_FOR_TESTS,
      },
      ...SALE,
    };
    const projectService = container.resolve(ProjectService);
    await expect(projectService.createProject(PROJECT_INFO as unknown as ProjectRequestDTO)).rejects.toThrowError(
      'Request data is missing some values'
    );
  });

  it('should fail because of missing value in request data (missing email)', async () => {
    const PROJECT_INFO = {
      project: {
        title: 'title',
        status: Status.PENDING,
        businessId: 1,
        ...PROJECT_COMMON_DATA_FOR_TESTS,
      },
      ...SALE,
    };
    const projectService = container.resolve(ProjectService);
    await expect(projectService.createProject(PROJECT_INFO as unknown as ProjectRequestDTO)).rejects.toThrowError(
      'Request data is missing some values'
    );
  });

  it('should fail because of missing value in request data (missing businessId)', async () => {
    const PROJECT_INFO = {
      project: {
        title: 'title',
        status: Status.PENDING,
        email: 'Test@test.com',
        ...PROJECT_COMMON_DATA_FOR_TESTS,
      },
      ...SALE,
    };
    const projectService = container.resolve(ProjectService);
    await expect(projectService.createProject(PROJECT_INFO as unknown as ProjectRequestDTO)).rejects.toThrowError(
      'Request data is missing some values'
    );
  });
});
