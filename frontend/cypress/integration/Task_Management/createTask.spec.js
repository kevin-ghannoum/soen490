/// <reference types="cypress" />

import { loginIntercept} from '../../helper/loginIntercept';
describe('test', ()=>{
  beforeEach(() => {
  loginIntercept()
});

afterEach(() => {
  cy.clearLocalStorage();
});

it('Should create a new Task', () => {
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
      method: 'POST',
      url: '/task',
    },
    { fixture: 'taskCreated.json', statusCode: 201 }
  ).as('createTaskAPI');

  cy.intercept(
    {
      method: 'POST',
      url: '/multipleAssigned',
    },
    { fixture: 'assignedCreated.json', statusCode: 201 }
  ).as('createAssignedAPI');

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

})
