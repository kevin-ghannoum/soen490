/// <reference types="cypress" />

import { loginIntercept } from '../helpers/loginIntercept';
import { getProjectIntercept } from '../helpers/projectIntercept';
import { getExpenses, getProductions, createProduction } from '../helpers/transactionIntercept';

describe('CreateExpense feature e2e test', () => {
  beforeEach(() => {
    loginIntercept();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('Should view a project transaction', () => {
    cy.wait(500);
    getProjectIntercept();
    getExpenses();
    getProductions();
    createProduction();

    cy.visit('/project_transaction/11');
    cy.get('#create_productions').click();
    cy.get('#description').type('this is a description');
    cy.get('#productionDate').type('2028-10-12');
    cy.get('#totalAmount').type('23');
    cy.get('#selectType').parent().click();
    cy.get('#progress').click();
    cy.get('form').submit();
    cy.wait('@createProductionAPI').its('response.statusCode').should('eq', 201);

    cy.intercept(
      {
        method: 'GET',
        url: '/transactions/productions?projectId=11',
      },
      { fixture: 'productionCreatedList.json', statusCode: 200, times: 1 }
    ).as('getCreatedProductionsAPI');
  });
});
