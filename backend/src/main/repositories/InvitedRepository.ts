import debug from 'debug';
import { injectable } from 'tsyringe';
import { InvitedCreationDTO, InvitedUpdateDTO } from '../dto/InvitedDTOs';
import { CRUD } from './CRUDInterface';
const log: debug.IDebugger = debug('app:InvitedRepository');
import { Invited } from '../models/Invited';

@injectable()
export default class InvitedRepository implements CRUD {
    constructor() {
        log('Created new instance of InvitedRepository');
    }

    public create = async (invitedInfo: InvitedCreationDTO): Promise<Invited> => {
        try {
            const createdInvited = Invited.build(invitedInfo);
            createdInvited.save();

            log(`Added new invite id: ${createdInvited.id} and email: ${createdInvited.email}`);
            return Promise.resolve(createdInvited);
        } catch (err: any) {
            log(err);
            return Promise.reject(err);
        }
    };

    public delete = async (invite: { id: number, email: string }): Promise<number> => {
        try {
            const deletedInvitedStatus = await Invited.destroy({
                where: {
                    id: invite.id,
                    email: invite.email
                }
            });

            log(`Invite with id ${invite.id} and email ${invite.email} has been deleted`);
            return Promise.resolve(deletedInvitedStatus);
        } catch (err: any) {
            log(err);
            return Promise.resolve(err);
        }
    };

    public update = async (invite: { id: number, email: string }, updatedValue: InvitedUpdateDTO): Promise<number> => {
        try {
            await Invited.update(updatedValue, {
                where: {
                    id: invite.id,
                    email: invite.email
                }
            });

            log(`Invite with id ${invite.id} and email: ${invite.email} has been updated`);
            return Promise.resolve(1);
        } catch (err: any) {
            return Promise.reject(err);
        }
    };

    public get = async (specificInvite: { id: number, email: string }): Promise<Invited | null> => {
        try {
            const invited = await Invited.findOne({
                where: {
                    id: specificInvite.id,
                    email: specificInvite.email
                }
            });

            log(`Invite with id ${invited?.id} and email ${invited?.email} has been retrieved`);
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
                    email: email
                }
            });

            log(`Invite with id ${invited?.id} and email ${invited?.email} has been retrieved`);
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
                    id: id
                }
            });

            log(`Invite with id ${invited?.id} and email ${invited?.email} has been retrieved`);
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
                    id: id
                }
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
                    email: email
                }
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