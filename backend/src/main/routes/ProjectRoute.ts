import express from 'express';
import { CommonRoutesConfig } from './CommonRoutesConfig';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { ProjectService } from '../services/ProjectService';
import HttpException from '../exceptions/HttpException';
import { WorksonService } from '../services/WorksOnService';
import { checkJwt, checkRole } from '../middleware/JWTMiddleware';
import { Roles } from '../security/Roles';
import { EmployeeAccountService } from '../services/EmployeeAccountService';
import { Project } from '../models/Project';

@injectable()
export default class ProjectRoute extends CommonRoutesConfig {
  constructor(
    @inject('express-app') app: express.Application,
    private projectService: ProjectService,
    private worksOn: WorksonService,
    private employeeAccountService: EmployeeAccountService
  ) {
    super(app, 'ProjectRoute');
  }

  configureRoutes(): express.Application {
    this.getApp()
      .route(`/project`)
      .all(
        checkJwt
        // checkRole(new Set([Roles.SUPERVISOR, Roles.BUSINESS]))
      )
      .post(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const newProject = await this.projectService.createProject(req.body);
          res.status(StatusCodes.CREATED).send(newProject);
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
      .route(`/project/booked`)
      .get(
        checkJwt,
        // checkRole(new Set([Roles.SUPERVISOR, Roles.BUSINESS])),
        async (req: express.Request, res: express.Response, next: express.NextFunction) => {
          try {
            const project = await this.projectService.getBookedProjectOfBusiness(Number(req.query.businessId));
            const booked: Project[] = [];
            project?.forEach((element: any) => {
              if(element.status === "BOOKED"){
                booked.push(element)
              }
            });
            res.status(StatusCodes.OK).send(booked);
          } catch (err) {
            next(err);
          }
        }
      );

    this.getApp()
      .route(`/project/:id`)
      .get(
        checkJwt,
        // checkRole(new Set([Roles.EMPLOYEE, Roles.SUPERVISOR, Roles.BUSINESS])),
        async (req: express.Request, res: express.Response, next: express.NextFunction) => {
          try {
            const project = await this.projectService.getProject(Number(req.params.id));
            const employees = await this.employeeAccountService.getUsernameEmployeeforProject(Number(req.params.id));
            const array = [project, employees];
            res.status(StatusCodes.OK).send(array);
          } catch (err) {
            next(err);
          }
        }
      )
      .delete(
        checkJwt,
        checkRole(new Set([Roles.SUPERVISOR, Roles.BUSINESS])),
        async (req: express.Request, res: express.Response, next: express.NextFunction) => {
          try {
            if ((await this.projectService.deleteProject(parseInt(req.params.id))) === 1) {
              res.status(StatusCodes.OK).send();
            } else {
              next(new HttpException(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND));
            }
          } catch (err) {
            next(err);
          }
        }
      )
      .put(
        checkJwt,
        checkRole(new Set([Roles.SUPERVISOR, Roles.BUSINESS])),
        async (req: express.Request, res: express.Response, next: express.NextFunction) => {
          try {
            await this.projectService.updateProject(req.body);
            res.status(StatusCodes.OK).send('Updated');
          } catch (err) {
            next(err);
          }
        }
      );

    return this.getApp();
  }
}
