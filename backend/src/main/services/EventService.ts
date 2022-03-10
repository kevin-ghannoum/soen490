import { injectable } from 'tsyringe';
import debug from 'debug';
import { EventCreationDTO, EventUpdateDTO } from '../dto/EventDTOs';
import { InvitedDTO, Status } from '../dto/InvitedDTOs';
import HttpException from '../exceptions/HttpException';
import { StatusCodes } from 'http-status-codes';
import EventRepository from '../repositories/EventRepository';
import InvitedRepository from '../repositories/InvitedRepository';
import { Event } from '../models/Event';
import { EmailService } from './EmailService'

const log: debug.IDebugger = debug('app:EventService');

@injectable()
export class EventService {
  constructor(private eventRepository: EventRepository, private invitedRepository: InvitedRepository, private emailService: EmailService) {
    log('Created new instance of EventService');
  }

  public createEvent = async (eventCreationDTO: EventCreationDTO): Promise<Event> => {
    if (EventService.isThereNullValueEventCreationDTO(eventCreationDTO)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
    }

    if (EventService.isDateNotValid(eventCreationDTO.start, eventCreationDTO.end)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Start and End date not valid');
    }

    const newEvent = await this.eventRepository.create(eventCreationDTO);

    eventCreationDTO.invitee.forEach(async (invitee) => {
      await this.emailService.sendEmail(invitee, "Meeting Invitation",
        `You are invited to join the following meeting: <br><br>
        Created By: ${eventCreationDTO.createdBy} <br>
        Title: ${eventCreationDTO.title} <br>
        ${eventCreationDTO.description ? (`Description: ${eventCreationDTO.description} <br>`) : (``)}
        ${eventCreationDTO.location ? (`Location: ${eventCreationDTO.location} <br>`) : (``)}
        Start date: ${(new Date(eventCreationDTO.start)).toLocaleString()} <br>
        End date: ${(new Date(eventCreationDTO.end)).toLocaleString()} <br><br>
        <p>Click <a href="${process.env.FRONTEND_DOMAIN}event/invitation/status?id=${newEvent.id}&accepted=true&email=${invitee}">here</a> to accept the meeting invitation</p>
        <p>Click <a href="${process.env.FRONTEND_DOMAIN}event/invitation/status?id=${newEvent.id}&accepted=false&email=${invitee}">here</a> to accept the meeting invitation</p>`);
    })

    return newEvent;
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

    const updatedEvent = await this.eventRepository.update(id, eventUpdateDTO);

    eventUpdateDTO.invitee.forEach(async (invitee) => {
      await this.emailService.sendEmail(invitee.email, "Meeting Updated",
        `A meeting you were invited to has been modified: <br><br>
        Created By: ${eventUpdateDTO.createdBy} <br>
        Title: ${eventUpdateDTO.title} <br>
        ${eventUpdateDTO.description ? (`Description: ${eventUpdateDTO.description} <br>`) : (``)}
        ${eventUpdateDTO.location ? (`Location: ${eventUpdateDTO.location} <br>`) : (``)}
        Start date: ${(new Date(eventUpdateDTO.start)).toLocaleString()} <br>
        End date: ${(new Date(eventUpdateDTO.end)).toLocaleString()}`);
    })

    return updatedEvent;
  };

  public updateInvitedStatus = async (id: number, email: string, accepted: boolean): Promise<number> => {
    const status: Status = accepted ? Status.ACCEPTED : Status.REJECTED;

    const updatedValue: InvitedDTO = {
      id: id,
      email: email,
      status: status
    }

    return this.invitedRepository.update({ id: id, email: email }, updatedValue)
  }

  public getEventById = async (id: number): Promise<Event | null> => {
    return this.eventRepository.get(id);
  };

  public deleteEvent = async (id: number): Promise<number> => {

    const eventInfo = await this.getEventById(id);

    const deletedEvent = await this.eventRepository.delete(id);

    eventInfo?.accounts.forEach(async (invitee) => {
      await this.emailService.sendEmail(invitee.getDataValue("Invited").dataValues.email, "Meeting Cancelled",
        `A meeting you were invited to has been cancelled: <br><br>
        Created By: ${eventInfo.createdBy} <br>
        Title: ${eventInfo.title} <br>
        ${eventInfo.description ? (`Description: ${eventInfo.description} <br>`) : (``)}
        ${eventInfo.location ? (`Location: ${eventInfo.location} <br>`) : (``)}
        Start date: ${(new Date(eventInfo.start)).toLocaleString()} <br>
        End date: ${(new Date(eventInfo.end)).toLocaleString()}`);
    })

    return deletedEvent;
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
    if (end <= start) {
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
