/// <reference types="cypress" />

import { loginIntercept} from '../../helpers/loginIntercept';
import { getTaskListIntercept, getTaskIntercept, getByTaskIdIntercept, getAllEmployeesIntercept, getProjectListIntercept, deletedTaskIntercept, deletedAssignByTaskIdIntercept } from '../../helpers/taskIntercept';

describe('DeleteTask feature e2e test', ()=>{
  beforeEach(() => {
    loginIntercept()
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  const setUpDeleteTaskIntercept = () => {
    getTaskListIntercept();
    getTaskIntercept();
    getByTaskIdIntercept();
    getAllEmployeesIntercept();
    getProjectListIntercept();
    deletedTaskIntercept();
    deletedAssignByTaskIdIntercept();
  }

  it('Should delete a task', () => {
    setUpDeleteTaskIntercept();

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

})