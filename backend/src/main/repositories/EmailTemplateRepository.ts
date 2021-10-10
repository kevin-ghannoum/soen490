import debug from 'debug';
import { injectable } from 'tsyringe';
import { EmailTemplateCreationDTO, EmailTemplateUpdateDTO } from '../dto/EmailTemplateDTO';
import { CRUD } from './CRUDInterface';
const log: debug.IDebugger = debug('app:EmailTemplateRepository');
import { EmailTemplate } from '../models/EmailTemplate';
import { Business } from '../models/Business';

@injectable()
export default class EmailTemplateRepository implements CRUD {
  constructor() {
    log('Created new instance of EmailTemplateRepository');
  }

  public create = async (emailTemplateInfo: EmailTemplateCreationDTO): Promise<EmailTemplate> => {
    try {
      const createdEmailTemplate = EmailTemplate.build(emailTemplateInfo);
      createdEmailTemplate.save();

      log(`Added new email templace ${createdEmailTemplate.title}`);
      return Promise.resolve(createdEmailTemplate);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public delete = async (id: number): Promise<number> => {
    try {
      const deleteEmailTemplate = await EmailTemplate.destroy({
        where: { id: id },
      });

      log(`Email Template ${id} has been deleted`);
      return Promise.resolve(deleteEmailTemplate);
    } catch (err: any) {
      log(err);
      return Promise.resolve(err);
    }
  };

  public update = async (id: number, updatedValue: EmailTemplateUpdateDTO): Promise<number> => {
    try {
      await EmailTemplate.update(updatedValue, { where: { id: id } });

      log(`Email Template ${id} has been updated`);
      return Promise.resolve(1);
    } catch (err: any) {
      return Promise.reject(err);
    }
  };

  public get = async (id: number): Promise<EmailTemplate | null> => {
    try {
      const emailTemplate = await EmailTemplate.findByPk(id, {
        include: [Business],
      });

      log(`Email Tempalte ${emailTemplate?.title} has been retrieved`);
      if (emailTemplate) {
        log(emailTemplate);
      } else {
        log('Email Template not found');
      }
      return Promise.resolve(emailTemplate);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public getAll = async (): Promise<EmailTemplate[]> => {
    try {
      const templates = await EmailTemplate.findAll();

      if (templates) {
        log(templates);
      } else {
        log('Email Template not found');
      }

      log(`Retrieved all email templates`);
      return Promise.resolve(templates);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };
}
