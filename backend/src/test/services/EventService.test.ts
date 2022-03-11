import 'reflect-metadata';
import { mock } from 'jest-mock-extended';
import { container } from 'tsyringe';
import { EventCreationDTO, EventUpdateDTO } from '../../main/dto/EventDTOs';
import { Status } from '../../main/dto/InvitedDTOs';
import { sequelizeMock } from '../helpers/SequelizeMock';
import EventRepository from '../../main/repositories/EventRepository';
import InvitedRepository from '../../main/repositories/InvitedRepository';
import { Event } from '../../main/models/Event';
import { EventService } from '../../main/services/EventService';
import { EmailService } from '../../main/services/EmailService';
import HttpException from '../../main/exceptions/HttpException';
import { StatusCodes } from 'http-status-codes';

describe('Event test', () => {
    let eventRepositoryMock: any = null;
    let invitedRepositoryMock: any = null;
    let emailServiceMock: any = null;

    beforeAll(() => {
        sequelizeMock();
    });

    beforeEach(() => {
        eventRepositoryMock = mock<EventRepository>();
        invitedRepositoryMock = mock<InvitedRepository>();
        emailServiceMock = mock<EmailService>();
        container.registerInstance(EventRepository, eventRepositoryMock);
        container.registerInstance(InvitedRepository, invitedRepositoryMock);
        container.registerInstance(EmailService, emailServiceMock);
    });

    afterEach(() => {
        container.clearInstances();
    });

    it('should create an event', async () => {
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        endDate.setDate(startDate.getDate() + 1);

        const EVENT_INFO: EventCreationDTO = {
            title: "event title",
            start: startDate,
            end: endDate,
            invitee: ["email1@email1.com", "email2@email2.com"],
            createdBy: "email3@email.com"
        };

        eventRepositoryMock.create.mockResolvedValue(
            Event.build(EVENT_INFO)
        );

        emailServiceMock.sendEmail.mockResolvedValue(() => Promise.resolve());

        const eventService: EventService = container.resolve(EventService);
        const result = await eventService.createEvent(EVENT_INFO);
        expect(result.title).toBe(EVENT_INFO.title);
        expect(result.start).toBe(EVENT_INFO.start);
        expect(result.end).toBe(EVENT_INFO.end);
        expect(result.createdBy).toBe(EVENT_INFO.createdBy);
    });

    it('should not create an event if data missing', async () => {
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        endDate.setDate(startDate.getDate() + 1);

        const expectedThrowError: HttpException = new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
        let errorThrow;

        const EVENT_INFO: EventCreationDTO = {
            title: "event title",
            start: startDate,
            end: endDate,
            invitee: [],
            createdBy: "email3@email.com"
        };

        eventRepositoryMock.create.mockResolvedValue(
            Event.build(EVENT_INFO)
        );

        const eventService: EventService = container.resolve(EventService);

        try {
            await eventService.createEvent(EVENT_INFO);
        } catch (e) {
            errorThrow = e;
        }

        expect(errorThrow).toEqual(expectedThrowError);
    });

    it('should not create an event if end date smaller than start date', async () => {
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        endDate.setDate(startDate.getDate() - 1);

        const expectedThrowError: HttpException = new HttpException(StatusCodes.BAD_REQUEST, 'Start and End date not valid')
        let errorThrow;

        const EVENT_INFO: EventCreationDTO = {
            title: "event title",
            start: startDate,
            end: endDate,
            invitee: ["email1@email1.com", "email2@email2.com"],
            createdBy: "email3@email.com"
        };

        eventRepositoryMock.create.mockResolvedValue(
            Event.build(EVENT_INFO)
        );

        const eventService: EventService = container.resolve(EventService);

        try {
            await eventService.createEvent(EVENT_INFO);
        } catch (e) {
            errorThrow = e;
        }

        expect(errorThrow).toEqual(expectedThrowError);
    });

    it('should not create an event if end date is equal to start date', async () => {
        const startDate: Date = new Date();
        const endDate: Date = startDate;

        const expectedThrowError: HttpException = new HttpException(StatusCodes.BAD_REQUEST, 'Start and End date not valid')
        let errorThrow;

        const EVENT_INFO: EventCreationDTO = {
            title: "event title",
            start: startDate,
            end: endDate,
            invitee: ["email1@email1.com", "email2@email2.com"],
            createdBy: "email3@email.com"
        };

        eventRepositoryMock.create.mockResolvedValue(
            Event.build(EVENT_INFO)
        );

        const eventService: EventService = container.resolve(EventService);

        try {
            await eventService.createEvent(EVENT_INFO);
        } catch (e) {
            errorThrow = e;
        }

        expect(errorThrow).toEqual(expectedThrowError);
    });

    it('should update an event', async () => {
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        endDate.setDate(startDate.getDate() + 1);

        const EVENT_INFO: EventUpdateDTO = {
            title: "event title",
            start: startDate,
            end: endDate,
            invitee: [{
                id: 1,
                email: "email1@email1.com",
                status: Status.PENDING
            }, {
                id: 1,
                email: "email2@email2.com",
                status: Status.PENDING
            }],
            createdBy: "email3@email.com"
        };

        eventRepositoryMock.update.mockResolvedValue(1);

        emailServiceMock.sendEmail.mockResolvedValue(() => Promise.resolve());

        const eventService: EventService = container.resolve(EventService);
        const result: number = await eventService.updateEvent(1, "email3@email.com", EVENT_INFO);
        expect(result).toBe(1)
    });

    it('should not update an event if the current user is not the creator of the event', async () => {
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        endDate.setDate(startDate.getDate() + 1);

        const expectedThrowError: HttpException = new HttpException(StatusCodes.FORBIDDEN, 'Cannot update an event that does not belong to you');
        let errorThrow;

        const EVENT_INFO: EventUpdateDTO = {
            title: "event title",
            start: startDate,
            end: endDate,
            invitee: [{
                id: 1,
                email: "email1@email1.com",
                status: Status.PENDING
            }, {
                id: 1,
                email: "email2@email2.com",
                status: Status.PENDING
            }],
            createdBy: "email3@email.com"
        };

        eventRepositoryMock.update.mockResolvedValue(1);

        emailServiceMock.sendEmail.mockResolvedValue(() => Promise.resolve());

        const eventService: EventService = container.resolve(EventService);

        try {
            await eventService.updateEvent(1, "email1@email1.com", EVENT_INFO);
        } catch (e) {
            errorThrow = e;
        }

        expect(errorThrow).toEqual(expectedThrowError)
    });

    it('should not update an event if data is missing', async () => {
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        endDate.setDate(startDate.getDate() + 1);

        const expectedThrowError: HttpException = new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
        let errorThrow;

        const EVENT_INFO: EventUpdateDTO = {
            title: "event title",
            start: startDate,
            end: endDate,
            invitee: [],
            createdBy: "email3@email.com"
        };

        eventRepositoryMock.update.mockResolvedValue(1);

        emailServiceMock.sendEmail.mockResolvedValue(() => Promise.resolve());

        const eventService: EventService = container.resolve(EventService);

        try {
            await eventService.updateEvent(1, "email3@email.com", EVENT_INFO);
        } catch (e) {
            errorThrow = e;
        }

        expect(errorThrow).toEqual(expectedThrowError)
    });

    it('should not update an event if end date is smaller than start date', async () => {
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        endDate.setDate(startDate.getDate() - 1);

        const expectedThrowError: HttpException = new HttpException(StatusCodes.BAD_REQUEST, 'Start and End date not valid');
        let errorThrow;

        const EVENT_INFO: EventUpdateDTO = {
            title: "event title",
            start: startDate,
            end: endDate,
            invitee: [{
                id: 1,
                email: "email1@email1.com",
                status: Status.PENDING
            }, {
                id: 1,
                email: "email2@email2.com",
                status: Status.PENDING
            }],
            createdBy: "email3@email.com"
        };

        eventRepositoryMock.update.mockResolvedValue(1);

        emailServiceMock.sendEmail.mockResolvedValue(() => Promise.resolve());

        const eventService: EventService = container.resolve(EventService);

        try {
            await eventService.updateEvent(1, "email3@email.com", EVENT_INFO);
        } catch (e) {
            errorThrow = e;
        }

        expect(errorThrow).toEqual(expectedThrowError)
    });

    it('should not update an event if end date is equal to start date', async () => {
        const startDate: Date = new Date();
        const endDate: Date = startDate;

        const expectedThrowError: HttpException = new HttpException(StatusCodes.BAD_REQUEST, 'Start and End date not valid');
        let errorThrow;

        const EVENT_INFO: EventUpdateDTO = {
            title: "event title",
            start: startDate,
            end: endDate,
            invitee: [{
                id: 1,
                email: "email1@email1.com",
                status: Status.PENDING
            }, {
                id: 1,
                email: "email2@email2.com",
                status: Status.PENDING
            }],
            createdBy: "email3@email.com"
        };

        eventRepositoryMock.update.mockResolvedValue(1);

        emailServiceMock.sendEmail.mockResolvedValue(() => Promise.resolve());

        const eventService: EventService = container.resolve(EventService);

        try {
            await eventService.updateEvent(1, "email3@email.com", EVENT_INFO);
        } catch (e) {
            errorThrow = e;
        }

        expect(errorThrow).toEqual(expectedThrowError)
    });

    it('should update invited status', async () => {
        invitedRepositoryMock.update.mockResolvedValue(1);

        const eventService: EventService = container.resolve(EventService);
        const result: number = await eventService.updateInvitedStatus(1, "email1@email1.com", true);
        expect(result).toBe(1)
    });
});
