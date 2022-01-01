/// <reference types="cypress" />

import { loginIntercept} from '../../helpers/loginIntercept';
import { getTaskListIntercept, getTaskIntercept, getByTaskIdIntercept, getAllEmployeesIntercept, getProjectListIntercept, editedTaskIntercept, editedAssignedByTaskIntercept } from '../../helpers/taskIntercept';

describe("EditTask feature e2e test", ()=>{
  beforeEach(() => {
    loginIntercept()
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  const setUpEditTaskIntercept = () => {
    getTaskListIntercept();
    getTaskIntercept();
    getByTaskIdIntercept();
    getAllEmployeesIntercept();
    getProjectListIntercept();
    editedTaskIntercept();
    editedAssignedByTaskIntercept();
  }

  it('Should edit a task', () => {
    setUpEditTaskIntercept();

    cy.visit('/tasks');
    cy.wait(1000);
    cy.get('#View-Task-Datagrid').should('exist');
    cy.get(`[data-id="1"] > .MuiDataGrid-cell--withRenderer > .MuiTypography-root`).click();
    cy.get('input[name=title]').clear().type("Written a new title");
    cy.get('textarea[name=description]').clear().type("Write your first passing test in 60 seconds.There are no servers, drivers, or any other dependencies to install or configure.");
    cy.get('input[name=deadlineDate]').clear().type('2043-12-25');
    cy.get('#status-select').type("{downarrow}{downarrow}{enter}");
    cy.get('#mui-component-select-employees').type("{enter}");
    cy.get('form').submit();

    cy.wait('@editTaskAPI').its('response.statusCode').should('eq', 201);
    cy.wait('@editAssignedAPI').its('response.statusCode').should('eq', 201);
  });
})
