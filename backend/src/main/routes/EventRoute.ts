import express from 'express';
import { CommonRoutesConfig } from './CommonRoutesConfig';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { EventService } from '../services/EventService';
import { getCurrentUserEmail } from '../utils/UserUtils';
import { EventCreationDTO } from '../dto/EventDTOs';
import { checkJwt } from '../middleware/JWTMiddleware';

@injectable()
export default class EventRoute extends CommonRoutesConfig {
  constructor(@inject('express-app') app: express.Application, private eventService: EventService) {
    super(app, 'EventRoute');
  }

  private getCurrentUser = (req: express.Request): string => {
    const authorizationToken: string = req.headers['authorization'] as string;
    const id_token: string = authorizationToken.split(' ')[1];
    return getCurrentUserEmail(id_token);
  };

  configureRoutes(): express.Application {
    this.getApp()
      .route(`/event`)
      .all(checkJwt)
      .post(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const currentUser: string = this.getCurrentUser(req);
          const newEventInfo = req.body as EventCreationDTO;
          newEventInfo.createdBy = currentUser;

          const newEvent = await this.eventService.createEvent(newEventInfo);
          res.status(StatusCodes.CREATED).send(newEvent);
        } catch (err) {
          next(err);
        }
      })
      .get(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const currentUser: string = this.getCurrentUser(req);

          const events = await this.eventService.getMyEvents(currentUser);
          res.status(StatusCodes.OK).send(events);
        } catch (err) {
          next(err);
        }
      });

    this.getApp()
      .route(`/event/:id`)
      .all(checkJwt)
      .get(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const event = await this.eventService.getEventById(Number(req.params.id));
          res.status(StatusCodes.OK).send(event);
        } catch (err) {
          next(err);
        }
      })
      .put(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const currentUser: string = this.getCurrentUser(req);

          await this.eventService.updateEvent(Number(req.params.id), currentUser, req.body);
          res.status(StatusCodes.OK).send();
        } catch (err) {
          next(err);
        }
      })
      .delete(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          await this.eventService.deleteEvent(Number(req.params.id));
          res.status(StatusCodes.OK).send();
        } catch (err) {
          next(err);
        }
      });

    this.getApp()
      .route(`/event/:id/accept`)
      .all(checkJwt)
      .post(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const email: string = req.query.email as string;
          const accepted: boolean = (req.query.accepted as string) === 'true';

          await this.eventService.updateInvitedStatus(Number(req.params.id), email, accepted);
          res.status(StatusCodes.OK).send();
        } catch (err) {
          next(err);
        }
      });

    return this.getApp();
  }
}
