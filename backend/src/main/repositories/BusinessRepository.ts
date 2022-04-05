import debug from 'debug';
import { injectable } from 'tsyringe';
import { BusinessCreationDTO, BusinessUpdateDTO } from '../dto/BusinessDTO';
import { CRUD } from './CRUDInterface';
const log: debug.IDebugger = debug('app:BusinessRepository');
import { Business } from '../models/Business';
import { BusinessAccount } from '../models/BusinessAccount';
import { Account } from '../models/Account';
import { SocialMediaPage } from '../models/SocialMediaPage';
import { Address } from '../models/Address';

@injectable()
export default class BusinessRepository implements CRUD {
  constructor() {
    log('Created new instance of BusinessRepository');
  }

  public create = async (businessInfo: BusinessCreationDTO): Promise<Business> => {
    try {
      const createdBusiness = Business.build(businessInfo);
      await createdBusiness.save();

      log(`Added new business ${createdBusiness.name}`);
      return Promise.resolve(createdBusiness);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public delete = async (id: number): Promise<number> => {
    try {
      const deleteBusinessStatus = await Business.destroy({
        where: { id: id },
      });

      log(`Business ${id} has been deleted`);
      return Promise.resolve(deleteBusinessStatus);
    } catch (err: any) {
      log(err);
      return Promise.resolve(err);
    }
  };

  public update = async (id: number, updatedValue: BusinessUpdateDTO): Promise<number> => {
    try {
      if (updatedValue.account) {
        await Account.update(updatedValue.account, { where: { email: updatedValue.account.email } });
        log(`Account ${updatedValue.account.email} has been updated`);
      }

      if (updatedValue.business) {
        await Business.update(updatedValue.business, { where: { id: id } });
        log(`Business ${id} has been updated`);
      }

      if (updatedValue.address) {
        await Address.update(updatedValue.address, { where: { id: updatedValue.address.id } });
        log(`Address ${updatedValue.address.id} has been updated`);
      }

      if (updatedValue.socialMediaPage && updatedValue.newSocialMediaPage) {
        await SocialMediaPage.update(updatedValue.newSocialMediaPage, {
          where: { link: updatedValue.socialMediaPage.link, name: updatedValue.socialMediaPage.name },
        });
        log(`SocialMediaPage ${updatedValue.socialMediaPage.name} has been updated`);
      }

      return Promise.resolve(1);
    } catch (err: any) {
      return Promise.reject(err);
    }
  };

  public get = async (id: number): Promise<Business | null> => {
    try {
      const business = await Business.findByPk(id, {
        include: [
          {
            model: BusinessAccount,
            include: [
              {
                model: Account,
                attributes: ['firstName', 'lastName', 'phoneNumber', 'username'],
                include: [{ model: Address }],
              },
            ],
          },
          { model: SocialMediaPage },
        ],
      });

      if (business) {
        log(business);
        log(`Business ${business?.name} has been retrieved`);
      } else {
        log('Business name not found');
      }

      return Promise.resolve(business);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public getAll = async (): Promise<Business[]> => {
    try {
      const businesses = await Business.findAll({
        include: [
          {
            model: BusinessAccount,
            include: [
              {
                model: Account,
                attributes: ['firstName', 'lastName', 'phoneNumber', 'username'],
                include: [{ model: Address }],
              },
            ],
          },
          { model: SocialMediaPage },
        ],
      });

      log(businesses);
      log(`Retrieved all businesses`);

      return Promise.resolve(businesses);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };
}
