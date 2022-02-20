/// <reference types="cypress" />

import { loginIntercept } from '../helpers/loginIntercept';
import { getProjectIntercept } from '../helpers/projectIntercept';
import { getExpenses, getProductions, createData, getUpdatedExpenses } from '../helpers/transactionIntercept';

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

    cy.intercept(
      {
        method: 'POST',
        url: '/transactions/expenses',
      },
      { fixture: 'expenseCreate.json', statusCode: 201, times: 1 }
    ).as('createExpenseAPI');

    cy.visit('/project_transaction/11');
    cy.get('#create_expenses').click();
    cy.get('#expenseDate').type('2028-10-12');
    cy.get('#selectType').parent().click();
    cy.get('#wages').click();
    createData();

    cy.wait('@createExpenseAPI').its('response.statusCode').should('eq', 201);
    getUpdatedExpenses();
  });
});
