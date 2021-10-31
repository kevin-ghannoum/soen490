import express from 'express';
import { CommonRoutesConfig } from './CommonRoutesConfig';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { ProjectService } from '../services/ProjectService';
import HttpException from '../exceptions/HttpException';
import { WorksonService } from '../services/WorksOnService';

@injectable()
export default class ProjectRoute extends CommonRoutesConfig {
  constructor(
    @inject('express-app') app: express.Application,
    private projectService: ProjectService,
    private worksOn: WorksonService
  ) {
    super(app, 'ProjectRoute');
  }

  configureRoutes(): express.Application {
    this.getApp()
      .route(`/project`)
      .post(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const newProject = await this.projectService.createProject(req.body);
          const dto = JSON.parse(JSON.stringify(newProject));
          res.status(StatusCodes.CREATED).send(dto);
        } catch (err) {
          next(err);
        }
      })
      .get(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const projectOfBusiness = await this.projectService.getProjectofBusiness(Number(req.query.businessId));
          res.status(StatusCodes.OK).send(projectOfBusiness);
        } catch (err) {
          next(err);
        }
      });

    this.getApp()
      .route(`/project/:id`)
      .get(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const project = await this.projectService.getProject(Number(req.params.id));
          const employees = await this.worksOn.getWorksOn(Number(req.params.id));
          const array = [];
          array.push(project);
          array.push(employees);
          res.status(StatusCodes.OK).send(array);
        } catch (err) {
          next(err);
        }
      })
      .delete(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          if ((await this.projectService.deleteProject(parseInt(req.params.id))) === 1) {
            res.status(StatusCodes.OK).send();
          } else {
            next(new HttpException(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND));
          }
        } catch (err) {
          next(err);
        }
      })
      .put(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const updateProject = await this.projectService.updateProject(req.body);
          res.status(StatusCodes.OK).send('Updated');
        } catch (err) {
          next(err);
        }
      });

    return this.getApp();
  }
}
