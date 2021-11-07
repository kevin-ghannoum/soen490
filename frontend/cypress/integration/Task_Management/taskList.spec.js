/// <reference types="cypress" />

beforeEach(() => {
    cy.visit('/');
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
    cy.get("#View-Task-Datagrid").should('exist');
  });
  