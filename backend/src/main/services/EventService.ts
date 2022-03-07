import { injectable } from 'tsyringe';
import debug from 'debug';
import { EventCreationDTO, EventUpdateDTO } from '../dto/EventDTOs';
import { Status } from '../dto/InvitedDTOs';
import HttpException from '../exceptions/HttpException';
import { StatusCodes } from 'http-status-codes';
import EventRepository from '../repositories/EventRepository';
import { Event } from '../models/Event';

const log: debug.IDebugger = debug('app:EventService');

@injectable()
export class EventService {
  constructor(private eventRepository: EventRepository) {
    log('Created new instance of LogEventService');
  }

  public createEvent = async (eventCreationDTO: EventCreationDTO): Promise<Event> => {
    if (EventService.isThereNullValueEventCreationDTO(eventCreationDTO)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
    }

    if (EventService.isDateNotValid(eventCreationDTO.start, eventCreationDTO.end)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Start and End date not valid');
    }

    return this.eventRepository.create(eventCreationDTO);
  };

  public getMyEvents = async (currentUser: string): Promise<Event[]> => {
    return this.eventRepository.getMyEventsAndInvited(currentUser);
  };

  public updateEvent = async (id: number, currentUser: string, eventUpdateDTO: EventUpdateDTO): Promise<number> => {
    if (eventUpdateDTO.createdBy != currentUser) {
      throw new HttpException(StatusCodes.FORBIDDEN, 'Cannot update an event that does not belong to you');
    }

    if (EventService.isThereNullValueEventUpdateDTO(id, eventUpdateDTO)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
    }

    if (EventService.isDateNotValid(eventUpdateDTO.start, eventUpdateDTO.end)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Start and End date not valid');
    }

    if (EventService.isStatusNotValid(eventUpdateDTO)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Status entered is invalid');
    }

    return this.eventRepository.update(id, eventUpdateDTO);
  };

  public getEventById = async (id: number): Promise<Event | null> => {
    return this.eventRepository.get(id);
  };

  public deleteEvent = async (id: number): Promise<number> => {
    return this.eventRepository.delete(id);
  };

  public static isThereNullValueEventCreationDTO = (eventCreationDTO: EventCreationDTO): boolean => {
    if (
      !eventCreationDTO.title ||
      !eventCreationDTO.start ||
      !eventCreationDTO.end ||
      typeof eventCreationDTO.invitee === 'undefined' ||
      !eventCreationDTO.invitee.length ||
      eventCreationDTO.invitee.includes('') ||
      !eventCreationDTO.createdBy
    ) {
      return true;
    }

    return false;
  };

  public static isThereNullValueEventUpdateDTO = (id: number, eventUpdateDTO: EventUpdateDTO): boolean => {
    if (
      !id ||
      !eventUpdateDTO.title ||
      !eventUpdateDTO.start ||
      !eventUpdateDTO.end ||
      typeof eventUpdateDTO.invitee === 'undefined' ||
      !eventUpdateDTO.invitee.length ||
      !eventUpdateDTO.createdBy ||
      eventUpdateDTO.invitee.some((invitee) => !invitee.id || !invitee.email || !invitee.status)
    ) {
      return true;
    }

    return false;
  };

  public static isDateNotValid = (start: Date, end: Date): boolean => {
    if (end < start) {
      return true;
    }

    return false;
  };

  public static isStatusNotValid = (eventUpdateDTO: EventUpdateDTO): boolean => {
    if (eventUpdateDTO.invitee.some((invitee) => Status[invitee.status] === undefined)) {
      return true;
    }
    return false;
  };
}
