import debug from 'debug';
import { injectable } from 'tsyringe';
import { NotificationCreationDTO, NotificationUpdateDTO } from '../dto/NotificationDTOs';
import { CRUD } from './CRUDInterface';
const log: debug.IDebugger = debug('app:NotificationRepository');
import { Notification } from '../models/Notification';

@injectable()
export default class NotificationRepository implements CRUD {
    constructor() {
        log('Created new instance of NotificationRepository');
    }

    public create = async (notificationInfo: NotificationCreationDTO): Promise<Notification> => {
        try {
            const createdNotification = Notification.build(notificationInfo);
            createdNotification.save();

            log(`Added new notification id ${createdNotification.id}`);
            return Promise.resolve(createdNotification);
        } catch (err: any) {
            log(err);
            return Promise.reject(err);
        }
    };

    public delete = async (id: number): Promise<number> => {
        try {
            const deletedNotificationStatus = await Notification.destroy({
                where: {
                    id: id
                }
            });

            log(`Notification with id ${id} has been deleted`);
            return Promise.resolve(deletedNotificationStatus);
        } catch (err: any) {
            log(err);
            return Promise.resolve(err);
        }
    };

    public update = async (id: number, updatedValue: NotificationUpdateDTO): Promise<number> => {
        try {
            await Notification.update(updatedValue, {
                where: {
                    id: id
                }
            });

            log(`Notification with id ${id} has been updated`);
            return Promise.resolve(1);
        } catch (err: any) {
            return Promise.reject(err);
        }
    };

    public get = async (specificNotification: { id: number, email: string }): Promise<Notification | null> => {
        try {
            const notification = await Notification.findOne({
                where: {
                    id: specificNotification.id,
                    email: specificNotification.email
                }
            });

            log(`Notification with id ${notification?.id} and email ${notification?.email} has been retrieved`);
            return Promise.resolve(notification);
        } catch (err: any) {
            log(err);
            return Promise.reject(err);
        }
    };

    public getByEmail = async (email: string): Promise<Notification | null> => {
        try {
            const notification = await Notification.findOne({
                where: {
                    email: email
                }
            });

            log(`Notification with id ${notification?.id} and email ${notification?.email} has been retrieved`);
            return Promise.resolve(notification);
        } catch (err: any) {
            log(err);
            return Promise.reject(err);
        }
    };

    public getById = async (id: number): Promise<Notification | null> => {
        try {
            const notification = await Notification.findOne({
                where: {
                    id: id
                }
            });

            log(`Notification with id ${notification?.id} and email ${notification?.email} has been retrieved`);
            return Promise.resolve(notification);
        } catch (err: any) {
            log(err);
            return Promise.reject(err);
        }
    };

    public getAllByEmail = async (email: string): Promise<Notification[] | null> => {
        try {
            const notification: Notification[] = await Notification.findAll({
                where: {
                    email: email
                }
            });

            log(`Notifications have been retrieved`);
            return Promise.resolve(notification);
        } catch (err: any) {
            log(err);
            return Promise.reject(err);
        }
    };

    public getAll = async (): Promise<Notification[]> => {
        try {
            const calls = await Notification.findAll();

            log(`Retrieved all calls`);
            return Promise.resolve(calls);
        } catch (err: any) {
            log(err);
            return Promise.reject(err);
        }
    };
}