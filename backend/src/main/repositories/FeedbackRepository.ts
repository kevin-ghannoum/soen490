import debug from 'debug';
import { injectable } from 'tsyringe';
import {
  FeedbackCreationDTO,
  FeedbackUpdateDTO,
} from '../dto/FeedbackDTOs';
import { CRUD } from './CRUDInterface';
const log: debug.IDebugger = debug('app:FeedbackRepository');
import { Feedback } from '../models/Feedback';

@injectable()
export default class FeedbackRepository implements CRUD {
  constructor() {
    log('Created new instance of FeedbackRepository');
  }

  public create = async (feedbackInfo: FeedbackCreationDTO): Promise<Feedback> => {
    try {
      const createdFeedback = Feedback.build(feedbackInfo);
      createdFeedback.save();

      log(`Added new feedback ${createdFeedback.title}`);
      return Promise.resolve(createdFeedback);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public delete = async (feedbackId: number): Promise<number> => {
    try {
      const deletedFeedbackStatus = await Feedback.destroy({
        where: {
          id: feedbackId,
        },
      });
      log(`Feedback with Id ${feedbackId} has been deleted`);
      return Promise.resolve(deletedFeedbackStatus);
    } catch (err: any) {
      log(err);
      return Promise.resolve(err);
    }
  };

  public update = async (
    feedbackId: number,
    updatedValue: FeedbackUpdateDTO
  ): Promise<number> => {
    try {
      await Feedback.update(updatedValue, { where: { id: feedbackId } });
      log(`Feedback with id ${feedbackId} has been updated`);
      return Promise.resolve(1);
    } catch (err: any) {
      return Promise.reject(err);
    }
  };

  public get = async (feedbackId: number): Promise<Feedback | null> => {
    try {
      const feedback = await Feedback.findByPk(feedbackId);

      log(`Feedback with Id ${feedback?.id} has been retrieved`);
      return Promise.resolve(feedback);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };

  public getAll = async (): Promise<Feedback[]> => {
    try {
      const feedbacks = await Feedback.findAll();

      log(`Retrieved all feedback`);
      return Promise.resolve(feedbacks);
    } catch (err: any) {
      log(err);
      return Promise.reject(err);
    }
  };
}
