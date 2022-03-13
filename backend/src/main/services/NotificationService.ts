import { injectable } from 'tsyringe';
import debug from 'debug';
import { Notification } from '../models/Notification';
import NotificationRepository from '../repositories/NotificationRepository';
const log: debug.IDebugger = debug('app:notificationService');

@injectable()
export class NotificationService{
    constructor(private notificationRepository: NotificationRepository){
        log('Created new instance of NotificationService');
    }

    public getAllByEmail = async(email: string): Promise<Notification[] | null> =>{
        return this.notificationRepository.getAllByEmail(email);
    }
}