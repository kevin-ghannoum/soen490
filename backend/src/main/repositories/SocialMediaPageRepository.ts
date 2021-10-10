import debug from 'debug';
import { injectable } from 'tsyringe';
import { SocialMediaPageCreationDTO, SocialMediaPageKey, SocialMediaPageUpdateDTO } from '../dto/SocialMediaPageDTO';
import { SocialMediaPage } from '../models/SocialMediaPage';
import { CRUD } from './CRUDInterface';
const log: debug.IDebugger = debug('app:SocialMediaPageRepository');

@injectable()
export default class SocialMediaPageRepository implements CRUD {
  constructor() {
    log('Created new instance of SocialMediaPageRepository');
  }
  public create = async (socialMediaPageInfo: SocialMediaPageCreationDTO): Promise<SocialMediaPage> => {
    try {
      const createdSocialMediaPage = SocialMediaPage.build(socialMediaPageInfo);
      createdSocialMediaPage.save();

      log(`Added new social media page ${createdSocialMediaPage.name}`);

      return Promise.resolve(createdSocialMediaPage);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public get = async (socialMediaPageKey: SocialMediaPageKey): Promise<SocialMediaPage | null> => {
    try {
      const socialMediaPage = await SocialMediaPage.findOne({
        where: {
          name: socialMediaPageKey.name,
          link: socialMediaPageKey.link,
        },
      });

      if (socialMediaPage) {
        log(`Social media page with name: ${socialMediaPage.name} and link ${socialMediaPage.link} found`);
      } else {
        log(`No social media page found with ${socialMediaPageKey.name} and ${socialMediaPageKey.link}`);
      }

      return Promise.resolve(socialMediaPage);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public delete = async (socialMediaPageKey: SocialMediaPageKey): Promise<number> => {
    try {
      const deletedSocialMediaStatus = await SocialMediaPage.destroy({
        where: {
          name: socialMediaPageKey.name,
          link: socialMediaPageKey.link,
        },
      });

      log(`Deleted social media page with name ${socialMediaPageKey.name} and link ${socialMediaPageKey.link}`);
      return Promise.resolve(deletedSocialMediaStatus);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public update = async (
    socialMediaPageKey: SocialMediaPageKey,
    updatedValue: SocialMediaPageUpdateDTO
  ): Promise<number> => {
    try {
      SocialMediaPage.update(updatedValue, {
        where: {
          name: socialMediaPageKey.name,
          link: socialMediaPageKey.link,
        },
      });

      log(`Updated Social media page`);
      return Promise.resolve(1);
    } catch (err: any) {
      return Promise.reject(err);
    }
  };

  public getAll = async (): Promise<SocialMediaPage[]> => {
    try {
      const socialMediaPages = await SocialMediaPage.findAll();

      log(`retrieved all social media page`);
      return Promise.resolve(socialMediaPages);
    } catch (err: any) {
      return Promise.reject(err);
    }
  };
}
