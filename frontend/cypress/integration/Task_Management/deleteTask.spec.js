/// <reference types="cypress" />

import { loginIntercept} from '../../helper/loginIntercept';

beforeEach(() => {
  loginIntercept()
});

afterEach(() => {
  cy.clearLocalStorage();
});

it('Should view a list of tasks', () => {
  cy.intercept(
    {
      method: 'GET',
      url: '/task',
    },
    { fixture: 'taskList.json', statusCode: 200 }
  );

  cy.intercept(
    {
      method: 'GET',
      url: '/task/1',
    },
    { fixture: 'getSingleTask.json', statusCode: 200 }
  ).as('getTaskByIdAPI');

  cy.intercept(
    {
      method: 'GET',
      url: '/assignedByTaskId/1',
    },
    { fixture: 'assignedCreated.json', statusCode: 200 }
  ).as('assignedTasksByIdAPI');

  cy.intercept(
    {
      method: 'GET',
      url: '/accounts/allEmployees',
    },
    { fixture: 'employeeList.json', statusCode: 200 }
  );

  cy.intercept(
    {
      method: 'GET',
      url: '/project?businessId=*',
    },
    { fixture: 'projectList.json', statusCode: 200 }
  );

  cy.intercept(
    {
      method: 'DELETE',
      url: '/task/1',
    },
    { statusCode: 200 }
  ).as('deleteTaskAPI');

  cy.intercept(
    {
      method: 'DELETE',
      url: '/assignedByTaskId/1',
    },
    { statusCode: 200 }
  ).as('deleteAssignedAPI');

  cy.visit('/tasks');
  cy.wait(1000);
  cy.get('#View-Task-Datagrid').should('exist');
  cy.get(`[data-id="1"] > .MuiDataGrid-cell--withRenderer > .MuiTypography-root`).click();

  //overloaded intercept after delete (intercepts are called from bottom up)
  cy.intercept(
    {
      method: 'GET',
      url: '**/task',
    },
    { fixture: 'taskListDelete.json', statusCode: 200 }
  );

  cy.get('#deleteButton').click();
  cy.get('#dialogDelete').click();

  cy.wait('@deleteTaskAPI').its('response.statusCode').should('eq', 200);
  cy.wait('@deleteAssignedAPI').its('response.statusCode').should('eq', 200);
});
