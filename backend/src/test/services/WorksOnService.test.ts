import 'reflect-metadata';
import { mock } from 'jest-mock-extended';
import { container } from 'tsyringe';
import { WorksOnCreationDTO } from '../../main/dto/WorksOnDTO';
import { WorksOn } from '../../main/models/WorksOn';
import WorksOnRepository from '../../main/repositories/WorksOnRepository';
import { WorksonService } from '../../main/services/WorksOnService';
import { sequelizeMock } from '../helpers/SequelizeMock';

describe('WorksOnService tests', () => {
  let worksOnRepository: any = null;

  beforeAll(() => {
    sequelizeMock();
  });

  beforeEach(() => {
    worksOnRepository = mock<WorksOnRepository>();
    container.registerInstance(WorksOnRepository, worksOnRepository);
  });

  afterEach(() => {
    container.clearInstances();
  });

  it('should create a worksOn', async () => {
    const WORKS_ON_INFO: WorksOnCreationDTO = {
      email: 'Test@test.com',
      id: 1,
    };

    worksOnRepository.create.mockResolvedValue(WorksOn.build(WORKS_ON_INFO));
    const worksOnService = container.resolve(WorksonService);
    const result = await worksOnService.createWorksOn(WORKS_ON_INFO);
    expect(result.email).toBe(WORKS_ON_INFO.email);
    expect(result.id).toBe(WORKS_ON_INFO.id);
  });

  it('should fail because of missing value in request data (missing id)', async () => {
    const WORKS_ON_INFO = {
      email: 'Test@test.com',
    };
    const worksOnService = container.resolve(WorksonService);
    await expect(worksOnService.createWorksOn(WORKS_ON_INFO as WorksOnCreationDTO)).rejects.toThrowError(
      'Request data is missing some values'
    );
  });

  it('should fail because of missing value in request data (missing email)', async () => {
    const WORKS_ON_INFO = {
      id: 5,
    };
    const worksOnService = container.resolve(WorksonService);
    await expect(worksOnService.createWorksOn(WORKS_ON_INFO as WorksOnCreationDTO)).rejects.toThrowError(
      'Request data is missing some values'
    );
  });
});
