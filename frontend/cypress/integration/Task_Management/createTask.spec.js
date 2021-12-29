/// <reference types="cypress" />

import { loginIntercept} from '../../helper/loginIntercept';
import { getTaskListIntercept, getAllEmployeesIntercept, getProjectListIntercept, createdTaskIntercept, createdAssignIntercept } from '../../helpers/taskIntercept';

describe('CreateTask feature e2e test', () => {
  beforeEach(() => {
    loginIntercept()
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  const setUpCreateTaskIntercept = () => {
    getTaskListIntercept();
    getAllEmployeesIntercept();
    getProjectListIntercept();
    createdTaskIntercept();
    createdAssignIntercept();
  }

  it('Should create a new Task', () => {
    setUpCreateTaskIntercept();

    cy.visit('/tasks/new');
    cy.get('input[name=title]').type("Testing Title");
    cy.get('textarea[name=description]').type("Testing Description");
    cy.get('input[name=deadlineDate]').type(new Date().toISOString().split('T')[0]);
    cy.get('#projectId-select').type("{enter}");
    cy.get('#mui-component-select-employees').type("{enter}{downarrow}{enter}");

    cy.get('form').submit();
    cy.wait('@createTaskAPI').its('response.statusCode').should('eq', 201);
    cy.wait('@createAssignedAPI').its('response.statusCode').should('eq', 201);
  });
});
