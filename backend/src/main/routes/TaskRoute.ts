import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { TaskService } from '../services/TaskService';
import { CommonRoutesConfig } from './CommonRoutesConfig';

@injectable()
export default class TaskRoute extends CommonRoutesConfig {

  constructor(@inject('express-app') app: express.Application, private taskService: TaskService) {
    super(app, 'TaskRoute');
  }

  configureRoutes(): express.Application {
    this.getApp()
      .route('/task')
      .post(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const newTask = await this.taskService.createTask(req.body);
          res.status(StatusCodes.CREATED).send(newTask);
        } catch (err) {
          next(err);
        }
      })
      .get(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const task = await this.taskService.getAllTask();
          res.status(StatusCodes.OK).send(task);
        } catch (err) {
          next(err);
        }
      });

    this.getApp()
      .route('/task/:taskId')
      .get(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const task = await this.taskService.getTask(req.params.taskId);
          res.status(StatusCodes.OK).send(task);
        } catch (err) {
          next(err);
        }
      })
      .delete(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const deletedTask = await this.taskService.deleteTask(req.params.taskId);
          res.sendStatus(StatusCodes.OK).send(deletedTask);
        } catch (err) {
          next(err);
        }
      })
      .post(async(req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const updatedTaskId = await this.taskService.updateTask(req.params.taskId, req.body);

          res.sendStatus(StatusCodes.CREATED).send(updatedTaskId);
        } catch (err) {
          next(err);
        }
      });
    return this.getApp();
  }
}
