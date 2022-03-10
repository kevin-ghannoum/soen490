import debug from 'debug';
import { injectable } from 'tsyringe';
import { InvitedDTO } from '../dto/InvitedDTOs';
import { CRUD } from './CRUDInterface';
const log: debug.IDebugger = debug('app:InvitedRepository');
import { Invited } from '../models/Invited';

@injectable()
export default class InvitedRepository implements CRUD {
  constructor() {
    log('Created new instance of InvitedRepository');
  }

  public create = async (invitedInfo: InvitedDTO): Promise<Invited> => {
    try {
      const createdInvited = Invited.build(invitedInfo);
      await createdInvited.save();

      log(`Added new invite id: ${createdInvited.id} and email: ${createdInvited.email}`);
      return Promise.resolve(createdInvited);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public delete = async (invite: { id: number; email: string }): Promise<number> => {
    try {
      const deletedInvitedStatus = await Invited.destroy({
        where: {
          id: invite.id,
          email: invite.email,
        },
      });

      log(`Invite with id ${invite.id} and email ${invite.email} has been deleted`);
      return Promise.resolve(deletedInvitedStatus);
    } catch (err: any) {
      log(err);
      return Promise.resolve(err);
    }
  };

  public update = async (invite: { id: number; email: string }, updatedValue: InvitedDTO): Promise<number> => {
    try {
      await Invited.update(updatedValue, {
        where: {
          id: invite.id,
          email: invite.email,
        },
      });

      log(`Invite with id ${invite.id} and email: ${invite.email} has been updated`);
      return Promise.resolve(1);
    } catch (err: any) {
      return Promise.reject(err);
    }
  };

  public get = async (specificInvite: { id: number; email: string }): Promise<Invited | null> => {
    try {
      const invited = await Invited.findOne({
        where: {
          id: specificInvite.id,
          email: specificInvite.email,
        },
      });

      if (invited) {
        log(`Invite with id ${invited?.id} and email ${invited?.email} has been retrieved`);
      } else {
        log(`Invited with id ${specificInvite.id} and email ${specificInvite.email} not found`);
      }

      return Promise.resolve(invited);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public getByEmail = async (email: string): Promise<Invited | null> => {
    try {
      const invited = await Invited.findOne({
        where: {
          email: email,
        },
      });

      if (invited) {
        log(`Invite with id ${invited?.id} and email ${invited?.email} has been retrieved`);
      } else {
        log(`Invited with email ${email} not found`);
      }
      return Promise.resolve(invited);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public getById = async (id: number): Promise<Invited | null> => {
    try {
      const invited = await Invited.findOne({
        where: {
          id: id,
        },
      });

      if (invited) {
        log(`Invite with id ${invited?.id} and email ${invited?.email} has been retrieved`);
      } else {
        log(`Invited with id ${id} not found`);
      }
      return Promise.resolve(invited);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public getAllById = async (id: number): Promise<Invited[] | null> => {
    try {
      const invited: Invited[] = await Invited.findAll({
        where: {
          id: id,
        },
      });

      log(`Invites have been retrieved`);
      return Promise.resolve(invited);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public getAllByEmail = async (email: string): Promise<Invited[] | null> => {
    try {
      const invited: Invited[] = await Invited.findAll({
        where: {
          email: email,
        },
      });

      log(`Invites have been retrieved`);
      return Promise.resolve(invited);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public getAll = async (): Promise<Invited[]> => {
    try {
      const invites = await Invited.findAll();

      log(`Retrieved all invites`);
      return Promise.resolve(invites);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };
}
