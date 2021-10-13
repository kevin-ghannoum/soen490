import debug from 'debug';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'tsyringe';
import { SocialMediaPageCreationDTO, SocialMediaPageKey } from '../dto/SocialMediaPageDTO';
import HttpException from '../exceptions/HttpException';
import { SocialMediaPage } from '../models/SocialMediaPage';
import SocialMediaPageRepository from '../repositories/SocialMediaPageRepository';
const log: debug.IDebugger = debug('app:SocialMediaPageService');

@injectable()
export class SocialMediaPageService {
  constructor(private socialMediaPageRepository: SocialMediaPageRepository) {
    log('Created instance of SocialMediaPageService');
  }

  public createSocialMediaPage = async (
    socialMediaPageCreationDTO: SocialMediaPageCreationDTO
  ): Promise<SocialMediaPage> => {
    if (SocialMediaPageService.isThereNullValueSocialMediaPageCreationDTO(socialMediaPageCreationDTO)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
    }
    return this.socialMediaPageRepository.create(socialMediaPageCreationDTO);
  };

  public getSocialMediaPage = async (socialMediaPageKey: SocialMediaPageKey): Promise<SocialMediaPage | null> => {
    return this.socialMediaPageRepository.create(socialMediaPageKey);
  };

  public deleteSocialMediaPage = async (socialMediaPageKey: SocialMediaPageKey): Promise<number> => {
    return this.socialMediaPageRepository.delete(socialMediaPageKey);
  };

  public static isThereNullValueSocialMediaPageCreationDTO = (
    socialMediaPageCreationDTO: SocialMediaPageCreationDTO
  ): boolean => {
    if (
      socialMediaPageCreationDTO === undefined ||
      !socialMediaPageCreationDTO.link ||
      !socialMediaPageCreationDTO.name
    ) {
      return true;
    }

    return false;
  };
}
