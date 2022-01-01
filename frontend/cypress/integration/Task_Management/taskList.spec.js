/// <reference types="cypress" />

import { loginIntercept } from '../../helpers/loginIntercept';

describe('TaskList feature e2e test', () => {
  beforeEach(() => {
    loginIntercept();
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
    ).as('getAllTaskAPI');

    cy.visit('/tasks');
    cy.get('#View-Task-Datagrid').should('exist');
  });
});
