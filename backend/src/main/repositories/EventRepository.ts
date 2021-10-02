import debug from 'debug';
import { injectable } from 'tsyringe';
import { EventCreationDTO, EventUpdateDTO } from '../dto/EventDTOs';
import { CRUD } from './CRUDInterface';
const log: debug.IDebugger = debug('app:EventRepository');
import { Event } from '../models/Event';

@injectable()
export default class EventRepository implements CRUD {
    constructor() {
        log('Created new instance of EventRepository');
    }

    public create = async (eventInfo: EventCreationDTO): Promise<Event> => {
        try {
            const createdEvent = Event.build(eventInfo);
            createdEvent.save();

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
                    id: id
                }
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
                    id: id
                }
            });

            log(`Event with id ${id} has been updated`);
            return Promise.resolve(1);
        } catch (err: any) {
            return Promise.reject(err);
        }
    };

    public get = async (id: number): Promise<Event | null> => {
        try {
            const event = await Event.findByPk(id);

            log(`Event with id ${event?.id} has been retrieved`);
            return Promise.resolve(event);
        } catch (err: any) {
            log(err);
            return Promise.reject(err);
        }
    };

    public getAll = async (): Promise<Event[]> => {
        try {
            const events = await Event.findAll();

            log(`Retrieved all events`);
            return Promise.resolve(events);
        } catch (err: any) {
            log(err);
            return Promise.reject(err);
        }
    };
}