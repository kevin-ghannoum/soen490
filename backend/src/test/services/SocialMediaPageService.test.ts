import 'reflect-metadata';
import { mock } from 'jest-mock-extended';
import { container } from 'tsyringe';
import { SocialMediaPageCreationDTO } from '../../main/dto/SocialMediaPageDTO';
import { SocialMediaPage } from '../../main/models/SocialMediaPage';
import SocialMediaPageRepository from '../../main/repositories/SocialMediaPageRepository';
import { SocialMediaPageService } from '../../main/services/SocialMediaPageService';
import { sequelizeMock } from '../helpers/SequelizeMock';

describe('SocialMediaPageService tests', () => {
  let socialMediaPageRepositoryMock: any = null;

  beforeAll(() => {
    sequelizeMock();
  });

  beforeEach(() => {
    socialMediaPageRepositoryMock = mock<SocialMediaPageRepository>();
    container.registerInstance(SocialMediaPageRepository, socialMediaPageRepositoryMock);
  });

  afterEach(() => {
    container.clearInstances();
  });

  it('should create a social media page', async () => {
    const SOCIAL_MEDIA_INFO: SocialMediaPageCreationDTO = {
      name: 'Test media',
      link: 'test.com',
      businessId: 1,
      email: 'test@gmail.com',
    };

    socialMediaPageRepositoryMock.create.mockResolvedValue(SocialMediaPage.build(SOCIAL_MEDIA_INFO));
    const socialMediaService = container.resolve(SocialMediaPageService);
    const result = await socialMediaService.createSocialMediaPage(SOCIAL_MEDIA_INFO);
    expect(result.link).toBe(SOCIAL_MEDIA_INFO.link);
    expect(result.name).toBe(SOCIAL_MEDIA_INFO.name);
  });

  it('should fail because of missing value in request data (missing link field)', async () => {
    const SOCIAL_MEDIA_INFO = {
      name: 'Test media',
      businessId: 1,
      email: 'test@gmail.com',
    };
    const socialMediaService = container.resolve(SocialMediaPageService);
    await expect(
      socialMediaService.createSocialMediaPage(SOCIAL_MEDIA_INFO as SocialMediaPageCreationDTO)
    ).rejects.toThrowError('Request data is missing some values');
  });
});
