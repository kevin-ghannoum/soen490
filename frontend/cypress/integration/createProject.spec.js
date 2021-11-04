/// <reference types="cypress" />

beforeEach(() => {
  cy.visit('/');
});

it('Should create a new project', () => {
  cy.intercept(
    {
      method: 'GET',
      url: '/accounts/client',
    },
    { fixture: 'clientList.json', statusCode: 200 }
  ).as('getClientAPI');

  cy.visit('/project');
  cy.get('#selectStatus').parent().click();
  cy.get('#booked').click();

  cy.get('#selectClient').type('a');
});
