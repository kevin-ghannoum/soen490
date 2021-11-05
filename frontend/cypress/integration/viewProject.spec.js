/// <reference types="cypress" />

beforeEach(() => {
    cy.visit('/');
  });
  
  it('Should view a list of project', () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/project?businessId=*',
      },
      { fixture: 'projectList.json', statusCode: 200 }
    ).as('getListOfPorjectAPI');
  
    cy.visit('/projects');
    cy.get("#View-Project-Grid").should('exist');
  });
  