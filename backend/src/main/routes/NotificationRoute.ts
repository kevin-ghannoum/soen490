import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { checkJwt } from '../middleware/JWTMiddleware';
import { NotificationService } from '../services/NotificationService';
import { getCurrentUserEmail } from '../utils/UserUtils';
import { CommonRoutesConfig } from './CommonRoutesConfig';

@injectable()
export default class NotificationRoute extends CommonRoutesConfig {
    constructor(@inject('express-app') app: express.Application, private notificationService: NotificationService){
        super(app, 'NotificationRoute');
    }   

    private getCurrentUser = (req: express.Request): string => {
        const authorizationToken: string = req.headers['authorization'] as string;
        const id_token: string = authorizationToken.split(' ')[1];
        return getCurrentUserEmail(id_token);
    };

    configureRoutes(): express.Application{
        this.getApp()
            .route(`/notifications`)
            .all(checkJwt)
            .get(async (req: express.Request, res: express.Response, next: express.NextFunction) =>{
                try{
                    const currentUser: string = this.getCurrentUser(req);

                    const notifications = await this.notificationService.getAllByEmail(currentUser);
                    res.status(StatusCodes.OK).send(notifications);
                }
                catch(err){
                    next(err);
                }
            });
            
        return this.getApp();
    }
}
