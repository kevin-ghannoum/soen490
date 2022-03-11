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
    let startDate: Date = new Date();
    let endDate: Date = new Date();
    let EVENT_INFO: EventCreationDTO = {
        title: "event title",
        start: startDate,
        end: endDate,
        invitee: ["email1@email1.com", "email2@email2.com"],
        createdBy: "email3@email.com"
    };

    let UPDATE_EVENT_INFO: EventUpdateDTO = {
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

        startDate = new Date();
        endDate = new Date();
        endDate.setDate(startDate.getDate() + 1);

        EVENT_INFO = {
            title: "event title",
            start: startDate,
            end: endDate,
            invitee: ["email1@email1.com", "email2@email2.com"],
            createdBy: "email3@email.com"
        };

        UPDATE_EVENT_INFO = {
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
    });

    afterEach(() => {
        container.clearInstances();
    });

    it('should create an event', async () => {
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
        const eventCreationExpectedThrowError: HttpException = new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
        let eventCreationErrorThrow;

        EVENT_INFO.invitee = []

        const eventCreationMissionDataService: EventService = container.resolve(EventService);

        try {
            await eventCreationMissionDataService.createEvent(EVENT_INFO);
        } catch (e) {
            eventCreationErrorThrow = e;
        }

        expect(eventCreationErrorThrow).toEqual(eventCreationExpectedThrowError);
    });

    it('should not create an event if end date smaller than start date', async () => {
        const eventCreationDateSmallerExpectedThrowError: HttpException = new HttpException(StatusCodes.BAD_REQUEST, 'Start and End date not valid')
        let eventCreationDateSmallerErrorThrow;

        EVENT_INFO.end.setDate(EVENT_INFO.start.getDate() - 1);

        const eventCreationDateSmallerService: EventService = container.resolve(EventService);

        try {
            await eventCreationDateSmallerService.createEvent(EVENT_INFO);
        } catch (e) {
            eventCreationDateSmallerErrorThrow = e;
        }

        expect(eventCreationDateSmallerErrorThrow).toEqual(eventCreationDateSmallerExpectedThrowError);
    });

    it('should not create an event if end date is equal to start date', async () => {
        const eventCreationDateEqualExpectedThrowError: HttpException = new HttpException(StatusCodes.BAD_REQUEST, 'Start and End date not valid')
        let eventCreationDateEqualErrorThrow;

        EVENT_INFO.end = EVENT_INFO.start;

        const eventCreationDateEqualService: EventService = container.resolve(EventService);

        try {
            await eventCreationDateEqualService.createEvent(EVENT_INFO);
        } catch (e) {
            eventCreationDateEqualErrorThrow = e;
        }

        expect(eventCreationDateEqualErrorThrow).toEqual(eventCreationDateEqualExpectedThrowError);
    });

    it('should update an event', async () => {
        eventRepositoryMock.update.mockResolvedValue(1);

        emailServiceMock.sendEmail.mockResolvedValue(() => Promise.resolve());

        const eventService: EventService = container.resolve(EventService);
        const result: number = await eventService.updateEvent(1, "email3@email.com", UPDATE_EVENT_INFO);
        expect(result).toBe(1)
    });

    it('should not update an event if the current user is not the creator of the event', async () => {
        const updateEventNotCurrentUserExpectedThrowError: HttpException = new HttpException(StatusCodes.FORBIDDEN, 'Cannot update an event that does not belong to you');
        let updateEventNotCurrentUserErrorThrow;

        const updateEventNotCurrentUserEventService: EventService = container.resolve(EventService);

        try {
            await updateEventNotCurrentUserEventService.updateEvent(1, "email1@email1.com", UPDATE_EVENT_INFO);
        } catch (e) {
            updateEventNotCurrentUserErrorThrow = e;
        }

        expect(updateEventNotCurrentUserErrorThrow).toEqual(updateEventNotCurrentUserExpectedThrowError)
    });

    it('should not update an event if data is missing', async () => {
        const updateEventDateMissingExpectedThrowError: HttpException = new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
        let updateEventDateMissingErrorThrow;

        UPDATE_EVENT_INFO.invitee = []

        const updateEventDateMissingEventService: EventService = container.resolve(EventService);

        try {
            await updateEventDateMissingEventService.updateEvent(1, "email3@email.com", UPDATE_EVENT_INFO);
        } catch (e) {
            updateEventDateMissingErrorThrow = e;
        }

        expect(updateEventDateMissingErrorThrow).toEqual(updateEventDateMissingExpectedThrowError)
    });

    it('should not update an event if end date is smaller than start date', async () => {
        const updateEventDateSmallerExpectedThrowError: HttpException = new HttpException(StatusCodes.BAD_REQUEST, 'Start and End date not valid');
        let updateEventDateSmallerErrorThrow;

        UPDATE_EVENT_INFO.end.setDate(UPDATE_EVENT_INFO.start.getDate() - 1)

        const updateEventDateSmallerEventService: EventService = container.resolve(EventService);

        try {
            await updateEventDateSmallerEventService.updateEvent(1, "email3@email.com", UPDATE_EVENT_INFO);
        } catch (e) {
            updateEventDateSmallerErrorThrow = e;
        }

        expect(updateEventDateSmallerErrorThrow).toEqual(updateEventDateSmallerExpectedThrowError)
    });

    it('should not update an event if end date is equal to start date', async () => {
        const updateEventDateEqualExpectedThrowError: HttpException = new HttpException(StatusCodes.BAD_REQUEST, 'Start and End date not valid');
        let updateEventDateEqualErrorThrow;

        UPDATE_EVENT_INFO.end = UPDATE_EVENT_INFO.start

        const updateEventDateEqualEventService: EventService = container.resolve(EventService);

        try {
            await updateEventDateEqualEventService.updateEvent(1, "email3@email.com", UPDATE_EVENT_INFO);
        } catch (e) {
            updateEventDateEqualErrorThrow = e;
        }

        expect(updateEventDateEqualErrorThrow).toEqual(updateEventDateEqualExpectedThrowError)
    });

    it('should update invited status', async () => {
        invitedRepositoryMock.update.mockResolvedValue(1);

        const eventService: EventService = container.resolve(EventService);
        const result: number = await eventService.updateInvitedStatus(1, "email1@email1.com", true);
        expect(result).toBe(1)
    });
});
