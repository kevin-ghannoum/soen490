import debug from 'debug';
import { injectable } from 'tsyringe';
import { EventCreationDTO, EventUpdateDTO } from '../dto/EventDTOs';
import { InvitedDTO, Status } from '../dto/InvitedDTOs';
import { CRUD } from './CRUDInterface';
const log: debug.IDebugger = debug('app:EventRepository');
import { Event } from '../models/Event';
import { Invited } from '../models/Invited';
import { Account } from '../models/Account';

@injectable()
export default class EventRepository implements CRUD {
  constructor() {
    log('Created new instance of EventRepository');
  }

  public create = async (eventInfo: EventCreationDTO): Promise<Event> => {
    try {
      const createdEvent = Event.build(eventInfo);
      await createdEvent.save();

      eventInfo.invitee.forEach(async (invitee) => {
        const invitedInfo: InvitedDTO = {
          status: Status.PENDING,
          email: invitee,
          id: createdEvent.id,
        };

        const createdInvited = Invited.build(invitedInfo);
        await createdInvited.save();
      });

      log(`Added new event ${createdEvent.id}`);
      return Promise.resolve(createdEvent);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public delete = async (id: number): Promise<number> => {
    try {
      const deletedEventStatus = await Event.destroy({
        where: {
          id: id,
        },
      });

      log(`Event with id ${id} has been deleted`);
      return Promise.resolve(deletedEventStatus);
    } catch (err: any) {
      log(err);
      return Promise.resolve(err);
    }
  };

  public update = async (id: number, updatedValue: EventUpdateDTO): Promise<number> => {
    try {
      await Event.update(updatedValue, {
        where: {
          id: id,
        },
      });

      updatedValue.invitee?.forEach(async (invitee) => {
        await Invited.update(invitee, {
          where: {
            id: invitee.id,
            email: invitee.email,
          },
        });
      });

      log(`Event with id ${id} has been updated`);
      return Promise.resolve(1);
    } catch (err: any) {
      return Promise.reject(err);
    }
  };

  public get = async (id: number): Promise<Event | null> => {
    try {
      const event = await Event.findByPk(id, {
        include: [
          {
            model: Account,
            attributes: ['firstName', 'lastName'],
            as: 'createdByAccount',
          },
          {
            model: Account,
            attributes: ['firstName', 'lastName'],
            as: 'accounts',
          },
        ],
      });

      if (event) {
        log(`Event with id ${event?.id} has been retrieved`);
      } else {
        log(`Event with id ${id} not found`);
      }

      return Promise.resolve(event);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public getAll = async (): Promise<Event[]> => {
    try {
      const events = await Event.findAll({ include: [Account] });

      log(`Retrieved all events`);
      return Promise.resolve(events);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public getMyEventsAndInvited = async (email: string): Promise<Event[]> => {
    try {
      const myEvents = await Event.findAll({
        where: {
          createdBy: email,
        },
        include: [
          {
            model: Account,
            attributes: ['firstName', 'lastName'],
            as: 'createdByAccount',
          },
          {
            model: Account,
            attributes: ['firstName', 'lastName'],
            as: 'accounts',
          },
        ],
      });

      const invitedEvents = await Event.findAll({
        include: [
          {
            model: Account,
            attributes: ['firstName', 'lastName'],
            as: 'createdByAccount',
          },
          {
            model: Account,
            where: {
              email: email,
            },
            attributes: ['firstName', 'lastName'],
            as: 'accounts',
          },
        ],
      });

      const events = myEvents.concat(invitedEvents);

      return Promise.resolve(events);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };
}
